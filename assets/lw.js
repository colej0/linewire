/* Linewire signup + inline prefs (shared) */
(function(){
var FS='https://formspree.io/f/mjygjovn';
var css='.lwp{text-align:left}.lwp h3{margin:0 0 4px;color:#047857}.lwp .ck{display:inline-flex;align-items:center;gap:6px;margin:4px 12px 4px 0;font-weight:500;font-size:.95rem}.lwp .ck input{width:auto;margin:0;padding:0}.lwp fieldset{border:1px solid #e5e7eb;border-radius:10px;padding:8px 12px;margin:10px 0}.lwp legend{font-weight:700;font-size:.9rem;padding:0 4px}.lwp input[type=text]{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;font:inherit}.lwp button{background:#059669;color:#fff;border:0;border-radius:10px;padding:12px 18px;font:inherit;font-weight:700;cursor:pointer;width:100%;margin-top:10px}.lwp .n{font-size:.85rem;color:#6b7280}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ck(n,v,c){return '<label class="ck"><input type="checkbox" name="'+n+'" value="'+v+'"'+(c?' checked':'')+'> '+v+'</label>'}
function prefsHTML(em,f_pro){return '<div class="lwp">'+(f_pro?'<h3>You\'re on the Pro waitlist ✓</h3>':'<h3>You\'re in ✓</h3>')+'<p><strong>Check your inbox (and spam folder)</strong> for the welcome email from news@linewirehq.com.</p>'+
'<form class="lw-inline-prefs" novalidate><input type="hidden" name="email" value="'+esc(em)+'"><input type="hidden" name="source" value="inline_prefs"><input type="hidden" name="_subject" value="Linewire prefs update">'+
'<p class="n" style="margin:10px 0 0">Optional: tailor your email (10 seconds)</p>'+
'<fieldset><legend>Sports</legend>'+ck('sports[]','NFL',1)+ck('sports[]','NBA',1)+ck('sports[]','MLB')+ck('sports[]','NHL')+ck('sports[]','CFB')+ck('sports[]','CBB')+'</fieldset>'+
'<fieldset><legend>Platforms</legend>'+ck('interests[]','PrizePicks')+ck('interests[]','Underdog')+ck('interests[]','DraftKings Pick 6')+ck('interests[]','Straight bets')+'</fieldset>'+
'<input type="text" name="teams" placeholder="Teams you follow (optional)" aria-label="Teams you follow (optional)">'+
'<button type="submit">Save preferences</button></form></div>'}
var ERR='Something went wrong — try again or email linewire@mail.grokbot.com.';
function showErr(f){var e=f.querySelector('.lw-err');if(!e){e=document.createElement('p');e.className='lw-err';e.setAttribute('role','alert');e.style.cssText='color:#b91c1c;font-size:.9rem;margin:8px 0 0';f.appendChild(e)}e.textContent=ERR;var b=f.querySelector('button,[type=submit]');if(b)b.disabled=false}
function post(f){return fetch(FS,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}})}
document.addEventListener('submit',function(ev){var f=ev.target;
 if(f.classList&&f.classList.contains('lw-inline-prefs')){ev.preventDefault();ev.stopPropagation();var box=f.parentNode;function ok(){box.innerHTML='<h3>Saved ✓</h3><p>Applies from your next Sunday (NFL) email. NBA Wednesdays coming soon.</p>'}post(f).then(function(r){if(r&&r.ok)ok();else showErr(f)},function(){showErr(f)});return}
 var a=f.getAttribute('action')||'';if(a.indexOf('formspree.io/f/mjygjovn')<0||f.id==='pf')return;
 ev.preventDefault();ev.stopPropagation();
 var em=(f.email&&f.email.value||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){if(f.email)f.email.focus();return}
 var u=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign'].forEach(function(k){var v=u.get(k);if(v&&!f.querySelector('input[name="'+k+'"]')){var i=document.createElement('input');i.type='hidden';i.name=k;i.value=v;f.appendChild(i)}});
 function done(){var okEl=f.parentNode.querySelector('.lw-ok,.ok');if(!okEl){okEl=document.createElement('div');okEl.className='card';f.parentNode.insertBefore(okEl,f.nextSibling)}
  okEl.innerHTML=prefsHTML(em,!!f.querySelector('input[name="interest"][value="pro"]'));okEl.style.display='block';f.style.display='none';['stickycta','topbanner'].forEach(function(id){var t=document.getElementById(id);if(t)t.remove()})}
 var b=f.querySelector('button,[type=submit]');if(b)b.disabled=true;var oe=f.querySelector('.lw-err');if(oe)oe.textContent='';
 post(f).then(function(r){if(r&&r.ok)done();else showErr(f)},function(){showErr(f)})},true);
})();
