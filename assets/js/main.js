/* CityH2O — core site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  window.CH2O={$:$,$$:$$,esc:esc,store:store};

  /* ---------- Private inbox routing: the address is never written in any page ---------- */
  var _k=[122,120,116,57,123,126,118,122,112,87,38,118,100,124,101,120,96,117,114,96];
  function inbox(){return _k.map(function(c){return String.fromCharCode(c^23)}).join('').split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from CityH2O.com')});
  });

  /* ---------- Theme ---------- */
  var root=document.documentElement,tb=$('#themeBtn');
  if(tb)tb.addEventListener('click',function(){var t=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',t);store('ch2o-theme',t)});

  /* ---------- Nav ---------- */
  var here=location.pathname.replace(/index\.html$/,'');
  $$('#menu a').forEach(function(a){var h=a.getAttribute('href').replace(/index\.html$/,'');
    if(h===here||(h!=='/'&&h.slice(-1)==='/'&&here.indexOf(h)===0)){a.classList.add('active');a.setAttribute('aria-current','page')}});
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu)bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});

  /* ---------- Reveal ---------- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.08});
    $$('.reveal').forEach(function(el){io.observe(el)});
  }else $$('.reveal').forEach(function(el){el.classList.add('in')});

  /* ---------- Cookie notice ---------- */
  var ck=$('#cookie');
  if(ck&&!store('ch2o-cookie')){ck.hidden=false;
    $$('[data-cookie]',ck).forEach(function(b){b.addEventListener('click',function(){store('ch2o-cookie',b.getAttribute('data-cookie'));ck.hidden=true;
      if(b.getAttribute('data-cookie')==='essential'){try{(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}catch(e){}}})})}

  /* ---------- Prefill forms from URL (?city=&concern=&from=) ---------- */
  var qs=new URLSearchParams(location.search);
  ['city','concern','from','plan'].forEach(function(k){var v=qs.get(k);if(!v)return;
    $$('[name="'+k+'"]').forEach(function(f){
      if(f.type==='radio'||f.type==='checkbox'){if(f.value===v)f.checked=true}else f.value=v})});

  /* ---------- Forms: AJAX to private inbox ---------- */
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      if(f._honey&&f._honey.value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k!=='_honey')data[k]=data[k]?data[k]+', '+v:v});
      data._subject=(f.getAttribute('data-subject')||'CityH2O form')+' — '+(data.city||data.name||data.email||'');
      data._template='table';data._captcha='false';data.page=location.pathname;data.submitted=new Date().toISOString();
      fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}})})
        .then(function(){
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received — we reply within one business day.'}
          f.reset();resetSteps(f);store('ch2o-lead','1');
          var thank=f.getAttribute('data-thanks');if(thank){var t=$(thank);if(t){t.hidden=false;f.hidden=true;t.scrollIntoView({behavior:'smooth',block:'center'})}}
        })
        .catch(function(){if(msg){msg.className='form-msg err';msg.textContent='Network hiccup — please try again in a minute.'}})
        .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });

  /* ---------- Multi-step forms ---------- */
  function resetSteps(f){if(f._go)f._go(0)}
  $$('form.multistep').forEach(function(f){
    var steps=$$('.step',f),ind=$$('.steps-ind span',f),i=0,no=$('[data-stepno]',f);
    function go(n){
      if(n>i){var bad=$$('input,select,textarea',steps[i]).filter(function(x){return !x.checkValidity()});if(bad.length){bad[0].reportValidity();return}}
      i=Math.max(0,Math.min(steps.length-1,n));
      steps.forEach(function(s,k){s.classList.toggle('active',k===i)});
      ind.forEach(function(s,k){s.classList.toggle('on',k<=i)});
      if(no)no.textContent=i+1;
      var last=i===steps.length-1,sub=$('button[type=submit]',f);
      $$('[data-next]',f).forEach(function(b){b.hidden=last});
      $$('[data-prev]',f).forEach(function(b){b.style.visibility=i?'visible':'hidden'});
      if(sub)sub.hidden=!last;
    }
    f._go=go;go(0);
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
    $$('.step[data-auto] .choice input[type=radio]',f).forEach(function(r){r.addEventListener('change',function(){setTimeout(function(){go(i+1)},200)})});
  });

  /* ---------- Video facades (YouTube loads only on click) ---------- */
  $$('.vid[data-id]').forEach(function(v){
    var id=v.getAttribute('data-id');
    v.style.backgroundImage='url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)';
    v.setAttribute('role','button');v.setAttribute('tabindex','0');
    v.innerHTML='<span class="play" aria-hidden="true">▶</span><span class="sr">Play: '+esc(v.getAttribute('data-title')||'video')+'</span>';
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+esc(v.getAttribute('data-title')||'Video')+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'}
    v.addEventListener('click',play);
    v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  });

  /* ---------- Guide table of contents ---------- */
  var toc=$('#toc'),prose=$('#prose');
  if(toc&&prose){var hs=$$('h2',prose);if(hs.length<2){toc.closest('.toc').remove()}else hs.forEach(function(h,n){if(!h.id)h.id='s'+(n+1)+'-'+h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40);
    var li=document.createElement('li');li.innerHTML='<a href="#'+h.id+'">'+esc(h.textContent)+'</a>';toc.appendChild(li)})}

  /* ---------- City data (search + filters) ---------- */
  var BANDS=['','Soft','Moderately hard','Hard','Very hard'];
  var citiesP=null;
  function cities(){if(!citiesP)citiesP=fetch('/data/cities.json').then(function(r){return r.json()}).catch(function(){return []});return citiesP}
  function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}

  $$('[data-city-search]').forEach(function(box){
    var inp=$('input',box),list=document.createElement('ul');list.className='suggest';list.hidden=true;list.setAttribute('role','listbox');box.appendChild(list);
    var hi=-1,res=[];
    function render(){list.innerHTML=res.map(function(c,n){return '<li><a role="option" class="'+(n===hi?'hi':'')+'" href="/cities.html#'+c.id+'"><span>'+esc(c.name)+', '+esc(c.region)+'</span><small class="muted">'+BANDS[c.band]+'</small></a></li>'}).join('')||'<li class="muted" style="padding:10px 12px">No match yet — <a href="/get-tested.html?city='+encodeURIComponent(inp.value)+'">get a free check for '+esc(inp.value)+'</a></li>';list.hidden=!inp.value}
    inp.addEventListener('input',function(){var q=norm(inp.value.trim());hi=-1;
      cities().then(function(all){res=q?all.filter(function(c){return norm(c.name+' '+c.region+' '+c.utility).indexOf(q)>-1}).slice(0,8):[];render()})});
    inp.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){hi=Math.min(res.length-1,hi+1);render();e.preventDefault()}
      else if(e.key==='ArrowUp'){hi=Math.max(0,hi-1);render();e.preventDefault()}
      else if(e.key==='Escape'){list.hidden=true}});
    box.addEventListener('submit',function(e){e.preventDefault();var pick=res[hi>-1?hi:0];
      location.href=pick?'/cities.html#'+pick.id:'/get-tested.html?city='+encodeURIComponent(inp.value)});
    document.addEventListener('click',function(e){if(!box.contains(e.target))list.hidden=true});
  });

  var grid=$('#cityGrid');
  if(grid){
    var fq=$('#cityQ'),fb=$('#cityBand'),fc=$('#cityCountry'),cnt=$('#cityCount'),cards=$$('.city-card',grid);
    function apply(){var q=norm(fq.value),b=fb.value,c=fc.value,n=0;
      cards.forEach(function(el){var ok=(!q||norm(el.getAttribute('data-s')).indexOf(q)>-1)&&(!b||el.getAttribute('data-band')===b)&&(!c||el.getAttribute('data-country')===c);el.hidden=!ok;if(ok)n++});
      if(cnt)cnt.textContent=n}
    [fq,fb,fc].forEach(function(x){x.addEventListener('input',apply)});
    if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t){t.setAttribute('open','');setTimeout(function(){t.scrollIntoView({block:'center'})},50)}}
  }

  /* ---------- Water news (refreshed daily by GitHub Actions) ---------- */
  var newsBoxes=$$('[data-news]');
  if(newsBoxes.length){
    fetch('/data/news.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){
      var items=(d&&d.items)||[];
      $$('[data-news-updated]').forEach(function(e){if(d.updated)e.textContent='Updated '+new Date(d.updated).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})});
      newsBoxes.forEach(function(box){
        var limit=+box.getAttribute('data-news')||100,topic='all',chips=$$('[data-topic]',box.parentNode);
        function draw(){var list=items.filter(function(i){return topic==='all'||i.topic===topic}).slice(0,limit);
          box.innerHTML=list.length?list.map(function(i){return '<div class="news-item"><div><span class="tag">'+esc(i.topic)+'</span><br><a href="'+esc(i.link)+'" target="_blank" rel="noopener nofollow">'+esc(i.title)+'</a><div class="src">'+esc(i.source||'')+(i.date?' · '+new Date(i.date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'')+'</div></div></div>'}).join(''):'<p class="muted">Headlines refresh every morning. Check back shortly, or read our <a href="/guides/">evergreen guides</a>.</p>'}
        chips.forEach(function(ch){ch.addEventListener('click',function(){topic=ch.getAttribute('data-topic');chips.forEach(function(x){x.classList.toggle('on',x===ch)});draw()})});
        draw();
      });
    }).catch(function(){newsBoxes.forEach(function(b){b.innerHTML='<p class="muted">News feed temporarily unavailable.</p>'})});
  }

  /* ---------- Daily water fact + seasonal tip (self-rotating) ---------- */
  var FACTS=[
    'A dripping faucet at one drip per second wastes more than 3,000 gallons a year.',
    'U.S. utilities must deliver an annual water quality report (CCR) to customers by July 1.',
    'Boil-water notice? A rolling boil for 1 minute is enough — 3 minutes above 6,500 ft.',
    'Lead pipes were banned for new U.S. plumbing in 1986, but millions of old service lines remain.',
    'Hardness of 1 grain per gallon equals about 17.1 mg/L of calcium carbonate.',
    'The EPA limit for PFOA and PFOS is 4 parts per trillion — roughly 4 drops in 20 Olympic pools.',
    'Use cold tap water for cooking and baby formula — hot water dissolves more lead from plumbing.',
    'Health Canada\'s lead guideline (5 µg/L) is half the incoming U.S. action level of 10 ppb.',
    'Carbon filters fix chlorine taste; reverse osmosis is the go-to for PFAS, nitrate, arsenic and fluoride.',
    'Private wells aren\'t covered by the Safe Drinking Water Act — owners are responsible for testing.',
    'A WaterSense-labeled toilet uses 1.28 gallons per flush or less, versus 3.5+ for many pre-1994 models.',
    'Chloramine lasts longer in pipes than chlorine but must be removed for aquariums and dialysis.'];
  var day=Math.floor(Date.now()/864e5);
  $$('[data-fact]').forEach(function(e){e.textContent=FACTS[day%FACTS.length]});
  var TIPS=['January: frozen-pipe season — let a pencil-thin stream run on the coldest nights.','February: get ready for Fix a Leak Week in March — check your toilet with a few drops of food coloring.','March: Fix a Leak Week — read your meter, wait 2 hours with no use, read again.','April: spring runoff can change taste and nitrate levels — well owners, test now.','May: lawn season — water before 9 a.m. to cut evaporation losses.','June: your annual water quality report is due by July 1 — look for it.','July: algae season — report earthy or musty taste to your utility.','August: hydrant flushing can cause brief discolouration — run cold water until clear.','September: back-to-school — ask whether your school has tested its taps for lead.','October: replace filter cartridges before the holidays; old carbon can release what it caught.','November: disconnect garden hoses and drain outdoor taps before the first hard freeze.','December: holiday guests strain septic systems — space out laundry and dishwasher loads.'];
  $$('[data-tip]').forEach(function(e){e.textContent=TIPS[new Date().getMonth()]});

  /* ---------- Soft lead nudge (once, not on lead pages) ---------- */
  if(store('ch2o-cookie')&&!store('ch2o-lead')&&!store('ch2o-nudge')&&!/get-tested|pros|contact|support|advertise/.test(location.pathname)){
    var shown=false;
    window.addEventListener('scroll',function onS(){if(shown)return;var p=(window.scrollY+innerHeight)/document.body.scrollHeight;if(p>.6){shown=true;window.removeEventListener('scroll',onS);store('ch2o-nudge','1');
      var n=document.createElement('div');n.className='cookie';n.setAttribute('role','dialog');n.setAttribute('aria-label','Free water check');
      n.innerHTML='<p><b>Curious what\'s in your tap?</b> Get a free, no-obligation water check for your address.</p><div><a class="btn btn-primary btn-sm" href="/get-tested.html?from=nudge">Start free check</a> <button class="btn btn-ghost btn-sm" type="button">No thanks</button></div>';
      document.body.appendChild(n);$('button',n).addEventListener('click',function(){n.remove()})}});
  }
})();
