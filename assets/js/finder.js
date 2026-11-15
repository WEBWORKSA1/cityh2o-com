/* CityH2O — Filter Finder logic */
(function(){
  'use strict';
  var f=document.getElementById('finder');if(!f)return;
  var q=new URLSearchParams(location.search).get('concern');
  var map={lead:'lead',pfas:'pfas',chlorine:'chlorine',tthm:'chlorine',hardness:'hardness',nitrate:'nitrate',arsenic:'arsenic',uranium:'arsenic',bacteria:'bacteria',fluoride:'fluoride',microplastics:'microplastics',iron:'iron',chromium6:'arsenic'};
  if(q&&map[q]){var b=f.querySelector('input[value="'+map[q]+'"]');if(b)b.checked=true}

  var T={
    pitcher:{n:'Certified pitcher or faucet-mount filter',cost:'$25–$80 + cartridges',std:'NSF/ANSI 42 & 53',note:'Cheapest start. Renter-friendly. Change cartridges on schedule — an expired filter is worse than none.'},
    block:{n:'Under-sink carbon block filter',cost:'$100–$350',std:'NSF/ANSI 42, 53 (and 401)',note:'Strong all-rounder for lead, chlorine, disinfection byproducts and many PFAS. Dedicated faucet, high flow.'},
    ro:{n:'Under-sink reverse osmosis (RO)',cost:'$200–$700 installed DIY · $500–$1,500 pro',std:'NSF/ANSI 58',note:'The broadest protection: PFAS, lead, nitrate, arsenic, fluoride, uranium, chromium-6. Countertop RO units exist for renters.'},
    whole:{n:'Whole-house carbon system',cost:'$800–$3,000 installed',std:'NSF/ANSI 42 (53 if available)',note:'Removes chlorine/chloramine and byproducts at every tap and shower. Pair with point-of-use filtration for lead.'},
    soft:{n:'Ion-exchange water softener',cost:'$1,000–$3,000 installed',std:'NSF/ANSI 44',note:'The only proven fix for heavy scale. Keep one unsoftened tap for drinking if you watch sodium.'},
    uv:{n:'UV disinfection system (+ sediment pre-filter)',cost:'$600–$1,500 installed',std:'NSF/ANSI 55 Class A',note:'Kills bacteria and viruses without chemicals. Essential for wells with any coliform history.'},
    iron:{n:'Oxidizing iron/manganese filter',cost:'$1,000–$2,500 installed',std:'Media listed to NSF/ANSI 61',note:'Stops orange stains and metallic taste. Size it from a lab test.'},
    test:{n:'Certified lab test first',cost:'$50–$400',std:'State-certified / accredited lab',note:'Know your numbers before you buy — especially for wells, lead, PFAS, nitrate and arsenic.'}
  };

  f.addEventListener('submit',function(e){
    e.preventDefault();
    var src=f.querySelector('input[name=src]:checked').value,
        c=Array.prototype.map.call(f.querySelectorAll('input[name=c]:checked'),function(x){return x.value}),
        where=f.where.value,rent=f.home.value==='rent',bud=+f.budget.value,picks=[],has=function(k){return c.indexOf(k)>-1};
    if(!c.length)c=['chlorine'];
    var needRO=has('pfas')||has('nitrate')||has('arsenic')||has('fluoride');
    if(src==='well'||has('lead')||has('pfas')||has('nitrate')||has('arsenic'))picks.push('test');
    if(needRO)picks.push(bud===1?'block':'ro');
    else if(has('lead')||has('microplastics'))picks.push(bud===1||rent?'pitcher':'block');
    else if(has('chlorine')&&where==='drink')picks.push(bud===1||rent?'pitcher':'block');
    if(where==='whole'&&!rent&&(has('chlorine')||has('lead')||has('pfas')))picks.push('whole');
    if(has('hardness')&&!rent)picks.push('soft');
    if(has('iron')&&!rent)picks.push('iron');
    if(has('bacteria')||src==='well')picks.push('uv');
    if(needRO&&bud===1)picks.push('ro');
    picks=picks.filter(function(v,i){return picks.indexOf(v)===i});
    var out=document.getElementById('finderOut');
    out.hidden=false;
    out.innerHTML='<h2>Your recommended setup</h2><p class="muted">Based on: '+(src==='well'?'private well':'city water')+' · '+c.join(', ')+' · '+(where==='whole'?'whole house':'drinking water')+(rent?' · renter':'')+'</p>'+
      picks.map(function(k,i){var t=T[k];return '<div class="card" style="margin-bottom:14px"><span class="tag">'+(i===0?'Step 1':'Step '+(i+1))+'</span><h3>'+t.n+'</h3><p><b>Look for:</b> '+t.std+' · <b>Budget:</b> '+t.cost+'</p><p class="mb0">'+t.note+'</p></div>'}).join('')+
      (has('bacteria')?'<div class="callout warn"><b>Active boil-water notice?</b> No home filter replaces boiling during a notice unless it is certified for microbiological reduction. Bring water to a rolling boil for 1 minute (3 minutes above 6,500 ft).</div>':'')+
      (rent&&(has('hardness')||where==='whole')?'<div class="callout">As a renter, ask your landlord about whole-house treatment — or use a showerhead filter and a countertop unit you can take with you.</div>':'');
    document.getElementById('recField').value=picks.map(function(k){return T[k].n}).join(' → ')+' | concerns: '+c.join(', ')+' | source: '+src;
    document.getElementById('finderLead').hidden=false;
    out.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();
