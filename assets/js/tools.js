/* CityH2O — calculators */
(function(){
  'use strict';
  function g(id){return document.getElementById(id)}
  function n(id){var v=parseFloat(g(id).value);return isFinite(v)?v:0}
  function money(x){return '$'+Math.round(x).toLocaleString()}
  function num(x,d){return (+x).toLocaleString(undefined,{maximumFractionDigits:d==null?0:d})}
  function on(ids,fn){ids.forEach(function(i){var e=g(i);if(e){e.addEventListener('input',fn);e.addEventListener('change',fn)}});fn()}

  /* 1. Lead risk */
  var lf=g('leadForm');
  if(lf)lf.addEventListener('submit',function(e){e.preventDefault();
    var s=n('l-year')+n('l-pipe')+n('l-util')+n('l-fix'),kids=n('l-kids')===1,max=11,pct=Math.round(s/max*100);
    var lvl=pct>=55?['High','bad','Lead may well be reaching your tap. Use only cold, flushed water for drinking and cooking, use a filter certified to NSF/ANSI 53 for lead, and get a certified lab test.']:
            pct>=25?['Moderate','warn','Some lead sources are possible. A certified lab test is the only way to know — and is cheap compared with the stakes.']:
                    ['Low','ok','Your home has few typical lead sources. Still flush taps that sit unused and use cold water for cooking.'];
    var o=g('leadOut');o.hidden=false;
    o.innerHTML='<p class="mb0">Estimated risk</p><div class="big">'+lvl[0]+' <span class="tag '+lvl[1]+'">'+pct+'/100</span></div><div class="bar"><i style="width:'+pct+'%"></i></div><p>'+lvl[2]+'</p>'+
      (kids?'<p><b>Because a child or pregnancy is involved,</b> testing is strongly recommended regardless of the score — children absorb lead more readily.</p>':'')+
      '<a class="btn btn-primary btn-sm" href="/get-tested.html?concern='+encodeURIComponent('Lead / old pipes')+'">Get a free lead testing plan →</a> <a class="btn btn-ghost btn-sm" href="/guides/lead-in-tap-water.html">Read the lead guide</a>';
  });

  /* 2. Hardness */
  if(g('h-val'))on(['h-val','h-unit'],function(){
    var f={mgl:1,gpg:17.12,dh:17.85,fh:10,mmol:100.09}[g('h-unit').value],m=n('h-val')*f;
    var band=m<=60?['Soft','ok']:m<=120?['Moderately hard','ok']:m<=180?['Hard','warn']:['Very hard','bad'];
    g('hardOut').innerHTML='<div class="big">'+num(m,1)+' mg/L <span class="tag '+band[1]+'">'+band[0]+'</span></div>'+
      '<div class="bar"><i style="width:'+Math.min(100,m/3)+'%"></i></div><p class="mb0">'+num(m/17.12,1)+' gpg · '+num(m/17.85,1)+' °dH · '+num(m/10,1)+' °fH · '+num(m/100.09,2)+' mmol/L</p>'+
      (m>120?'<p class="mb0" style="margin-top:8px">At this level, scale builds up in water heaters and appliances. <a href="#softener">See if a softener pays off →</a></p>':'');
  });

  /* 3. Leak */
  if(g('k-type'))on(['k-type','k-rate','k-price'],function(){
    var t=g('k-type').value,r=n('k-rate'),gal;g('k-rate-o').textContent=r;
    g('k-rate').previousElementSibling.firstChild.textContent=t==='drip'?'Drips per minute ':t==='toilet'?'Severity (1 = faint, 300 = constant) ':'Drips per minute ';
    /* ~0.36 mL per drip (EPA: 1 drip/sec ≈ 3,000+ gal/yr); silent toilet leak up to ~200 gal/day */
    gal=t==='toilet'?(r/300)*200*365:r*0.36*525600/3785.41;
    var cost=gal/1000*n('k-price');
    g('leakOut').innerHTML='<div class="big">'+num(gal)+' gallons/year</div><p class="mb0">≈ <b>'+money(cost)+'</b> a year on your bill · '+num(gal*3.785)+' litres · '+num(gal/17)+' average showers.</p><p class="small muted mb0" style="margin-top:6px">Assumes ~0.36 mL per drip (one drip per second ≈ 3,000 gallons a year); a silent toilet leak can waste up to 200 gallons a day.</p>';
  });

  /* 4. Bottled vs tap */
  if(g('b-people'))on(['b-people','b-liters','b-price','b-filter'],function(){
    var L=n('b-people')*n('b-liters')*365,b=L*n('b-price'),f=n('b-filter')+L*0.004,save=b-f;
    g('bottledOut').innerHTML='<div class="grid g3"><div><p class="mb0 muted">Bottled per year</p><div class="big">'+money(b)+'</div></div><div><p class="mb0 muted">Filtered tap per year</p><div class="big">'+money(f)+'</div></div><div><p class="mb0 muted">You save</p><div class="big" style="color:var(--ok)">'+money(save)+'</div></div></div><p class="mb0">That\'s about '+num(L/0.5)+' half-litre bottles a year kept out of the waste stream.</p>';
  });

  /* 5. Usage */
  if(g('u-people'))on(['u-people','u-shower','u-head','u-flush','u-toilet','u-loads','u-washer','u-dish','u-price2'],function(){
    var p=n('u-people'),sh=p*n('u-shower')*n('u-head'),tl=p*n('u-flush')*n('u-toilet'),ld=n('u-loads')*n('u-washer')/7,dw=n('u-dish')*4/7,fa=p*8,tot=sh+tl+ld+dw+fa;
    var eff=p*n('u-shower')*1.5+p*n('u-flush')*1.28+n('u-loads')*14/7+dw+fa*0.7,save=(tot-eff)*365;
    var rows=[['Showers',sh],['Toilets',tl],['Laundry',ld],['Dishwasher',dw],['Faucets',fa]];
    g('usageOut').innerHTML='<div class="big">'+num(tot)+' gal/day</div><p>'+num(tot/p)+' gallons per person · '+money(tot*365/1000*n('u-price2'))+' per year</p>'+
      rows.map(function(r){return '<div class="small">'+r[0]+' — '+num(r[1])+' gal<div class="bar"><i style="width:'+(r[1]/tot*100)+'%"></i></div></div>'}).join('')+
      (save>0?'<p class="mb0">Efficient fixtures could save <b>'+num(save)+' gallons</b> (≈'+money(save/1000*n('u-price2'))+') a year.</p>':'');
  });

  /* 6. Softener payback */
  if(g('s-hard'))on(['s-hard','s-cost','s-run','s-people'],function(){
    var h=n('s-hard'),p=n('s-people'),benefit=Math.max(0,(h-3))*7*(0.6+0.4*p/3)*3.2,net=benefit-n('s-run'),yrs=net>0?n('s-cost')/net:Infinity;
    g('softOut').innerHTML='<div class="grid g3"><div><p class="mb0 muted">Est. scale costs avoided / yr</p><div class="big">'+money(benefit)+'</div></div><div><p class="mb0 muted">Net yearly benefit</p><div class="big">'+money(net)+'</div></div><div><p class="mb0 muted">Payback</p><div class="big">'+(isFinite(yrs)&&yrs<40?num(yrs,1)+' yrs':'Not worth it')+'</div></div></div>'+
      (h<7?'<p class="mb0">Below ~7 gpg most homes don\'t need a softener.</p>':'<p class="mb0">Typical softener lifespan is 10–15 years. <a href="/get-tested.html?concern='+encodeURIComponent('Hard water & scale')+'">Get softener quotes from certified local pros →</a></p>');
  });
})();
