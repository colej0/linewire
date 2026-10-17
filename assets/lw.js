/* Linewire signup + inline prefs (shared) */
(function(){
var FS='https://formspree.io/f/mjygjovn';
var css='.lwp{text-align:left}.lwp h3{margin:0 0 4px;color:#047857}.lwp .ck{display:inline-flex;align-items:center;gap:6px;margin:4px 12px 4px 0;font-weight:500;font-size:.95rem}.lwp .ck input{width:auto;margin:0;padding:0}.lwp fieldset{border:1px solid #e5e7eb;border-radius:10px;padding:8px 12px;margin:10px 0}.lwp legend{font-weight:700;font-size:.9rem;padding:0 4px}.lwp input[type=text]{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font:inherit}.lwp button{background:#059669;color:#fff;border:0;border-radius:10px;padding:12px 18px;font:inherit;font-weight:700;cursor:pointer;width:100%;margin-top:10px}.lwp .n{font-size:.85rem;color:#6b7280}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ck(n,v,c,l){return '<label class="ck"><input type="checkbox" name="'+n+'" value="'+v+'"'+(c?' checked':'')+'> '+(l||v)+'</label>'}
function prefsHTML(em,f_pro){return '<div class="lwp">'+(f_pro?'<h3>You\'re on the Pro waitlist ✓</h3>':'<h3>You\'re in ✓</h3>')+'<p><strong>Check your inbox (and spam folder)</strong> for the welcome email from news@linewirehq.com.</p>'+
'<form class="lw-inline-prefs" novalidate><input type="hidden" name="email" value="'+esc(em)+'"><input type="hidden" name="source" value="inline_prefs"><input type="hidden" name="_subject" value="Linewire prefs update">'+
'<p class="n" style="margin:10px 0 0">Optional: tailor your email (10 seconds)</p>'+
'<fieldset><legend>Sports</legend>'+ck('sports[]','NFL',1)+'<p class="n" style="margin:6px 0 2px">Notify me when live:</p>'+ck('sports[]','NBA')+ck('sports[]','MLB')+ck('sports[]','NHL')+ck('sports[]','CFB')+ck('sports[]','CBB')+'</fieldset>'+
'<fieldset><legend>Platforms</legend>'+ck('interests[]','PrizePicks')+ck('interests[]','Straight bets')+'<p class="n" style="margin:6px 0 2px">Coming soon — notify me:</p>'+ck('interests[]','Underdog')+ck('interests[]','DraftKings Pick 6')+'</fieldset>'+
'<input type="text" name="teams" placeholder="Teams you follow (optional)" aria-label="Teams you follow (optional)">'+
'<button type="submit">Save preferences</button></form></div>'}
var ERR='Something went wrong — try again or email news@linewirehq.com.';
function showErr(f){var e=f.querySelector('.lw-err');if(!e){e=document.createElement('p');e.className='lw-err';e.setAttribute('role','alert');e.style.cssText='color:#b91c1c;font-size:.9rem;margin:8px 0 0';f.appendChild(e)}e.textContent=ERR;var b=f.querySelector('button,[type=submit]');if(b)b.disabled=false}
window.lwErr=showErr;
function post(f){return fetch(FS,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}})}
document.addEventListener('submit',function(ev){var f=ev.target;
 if(f.classList&&f.classList.contains('lw-inline-prefs')){ev.preventDefault();ev.stopPropagation();var box=f.parentNode;var ch=[].map.call(f.querySelectorAll('input[type=checkbox]:checked'),function(i){return i.value});var tm=(f.teams&&f.teams.value||'').trim();if(tm)ch.push(tm);function ok(){box.innerHTML='<h3>Saved ✓</h3><p><strong>You\'ll get: '+esc(ch.length?ch.join(' · '):'NFL')+'</strong></p><p>Applies from your next Sunday (NFL) email.'+(ch.indexOf('NBA')>-1?' We\'ll tell you when NBA Wednesdays go live.':'')+'</p>'}post(f).then(function(r){if(r&&r.ok)ok();else showErr(f)},function(){showErr(f)});return}
 var a=f.getAttribute('action')||'';if(a.indexOf('formspree.io/f/mjygjovn')<0||f.id==='pf')return;
 ev.preventDefault();ev.stopPropagation();
 var em=(f.email&&f.email.value||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){if(f.email)f.email.focus();return}
 var u=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign'].forEach(function(k){var v=u.get(k);if(v&&!f.querySelector('input[name="'+k+'"]')){var i=document.createElement('input');i.type='hidden';i.name=k;i.value=v;f.appendChild(i)}});
 function done(){var okEl=f.parentNode.querySelector('.lw-ok,.ok');if(!okEl){okEl=document.createElement('div');okEl.className='card';f.parentNode.insertBefore(okEl,f.nextSibling)}
  okEl.innerHTML=prefsHTML(em,!!f.querySelector('input[name="interest"][value="pro"]'));okEl.style.display='block';f.style.display='none';try{okEl.scrollIntoView({behavior:'smooth',block:'center'})}catch(x){okEl.scrollIntoView()}['stickycta','topbanner'].forEach(function(id){var t=document.getElementById(id);if(t)t.remove()})}
 var b=f.querySelector('button,[type=submit]');if(b)b.disabled=true;var oe=f.querySelector('.lw-err');if(oe)oe.textContent='';
 post(f).then(function(r){if(r&&r.ok)done();else showErr(f)},function(){showErr(f)})},true);
})();
/* This-week hook: one JSON refresh updates every tool page */
(function(){function run(){var els=document.querySelectorAll('[data-lw-week]');if(!els.length||!window.fetch)return;
var st=document.createElement('style');st.textContent='.lwwk{margin:0 0 14px;font-weight:700;font-size:.95rem}.lwwk a{color:#047857;text-decoration:none;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;padding:6px 12px;display:inline-block}.lwwk a:hover{background:#d1fae5}';document.head.appendChild(st);
fetch('/assets/this-week.json',{cache:'no-cache'}).then(function(r){return r&&r.ok?r.json():null}).then(function(j){if(!j||!j.top||!j.updated_iso)return;var age=Date.now()-Date.parse(j.updated_iso);if(!(age>=0&&age<8*864e5))return;
var t=j.top,m=t.spread_move?t.spread_move_txt:(t.total_move?'total '+t.total_move_txt:'');if(!m||!t.away||!t.home)return;
[].forEach.call(els,function(el){el.textContent='';var a=document.createElement('a');a.href='/line-moves/';a.textContent='This week\u2019s biggest NFL move: '+t.away+' @ '+t.home+', '+m+' \u2192';el.appendChild(a);el.hidden=false})}).catch(function(){})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run()})();
/* Growth helpers (attribution src/ref/utm + cookieless analytics): load once sitewide */
(function(){if(window.__lwGrowth||document.querySelector('script[src*="lw-growth.js"]'))return;var s=document.createElement('script');s.src='/assets/lw-growth.js?v=20261017a';s.async=true;(document.head||document.documentElement).appendChild(s)})();
