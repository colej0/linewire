/* Linewire growth helpers: signup attribution (src/ref/utm hidden fields) + cookieless analytics loader + lwTrack().
   Standalone so it can ship without touching lw.js. Safe no-op until UMAMI_ID is set. */
(function(){
if(window.__lwGrowth)return;window.__lwGrowth=1;
var UMAMI_ID='';               // ← paste the Umami Cloud website ID here (Settings → Websites → Edit → Website ID)
var UMAMI_SRC='https://cloud.umami.is/script.js';
var HOSTS=/(^|\.)linewirehq\.com$/;
var LS=window.localStorage,now=Date.now(),D30=30*864e5;
function get(k){try{return JSON.parse(LS.getItem(k)||'null')}catch(e){return null}}
function set(k,v){try{LS.setItem(k,JSON.stringify(v))}catch(e){}}
function clean(v,n){return String(v||'').toLowerCase().replace(/[^a-z0-9_\-.]/g,'').slice(0,n||40)}
var q=new URLSearchParams(location.search);
function refSrc(){var r=document.referrer;if(!r)return 'direct';var h;try{h=new URL(r).hostname.replace(/^www\./,'')}catch(e){return 'direct'}
 if(HOSTS.test(h))return '';if(/(^|\.)google\.|bing\.com$|duckduckgo\.com$|search\.yahoo\.com$|ecosia\.org$|search\.brave\.com$/.test(h))return 'search';
 if(/^(t\.co|x\.com|twitter\.com|mobile\.twitter\.com)$/.test(h))return 'x';if(/reddit\.com$|^redd\.it$/.test(h))return 'reddit';if(/discord(app)?\.com$|discord\.gg$/.test(h))return 'discord';
 if(/joinlinewire\.com$/.test(h))return 'joinlinewire';return clean(h,40)}
// this visit
var us=clean(q.get('utm_source')),visit=us||refSrc();
var touch={src:visit,utm_source:us,utm_medium:clean(q.get('utm_medium')),utm_campaign:clean(q.get('utm_campaign'),60),landing:location.pathname,ts:now};
var ft=get('lw_ft');if(visit&&(!ft||now-ft.ts>90*864e5)){ft=touch;set('lw_ft',ft)}           // first touch (90d)
if(visit&&visit!=='direct')set('lw_lt',touch);var lt=get('lw_lt')||touch;                 // last non-direct touch
var r=q.get('ref');if(r&&/^[A-Za-z0-9_-]{3,24}$/.test(r))set('lw_ref',{c:r,ts:now});
var ref=get('lw_ref');if(ref&&now-ref.ts>D30)ref=null;
function field(f,n,v){if(!v)return;var i=f.querySelector('input[name="'+n+'"]');if(!i){i=document.createElement('input');i.type='hidden';i.name=n;f.appendChild(i)}if(!i.getAttribute('data-lw-keep'))i.value=v}
function tag(f){var a=f.getAttribute('action')||'';if(a.indexOf('formspree.io')<0&&!f.classList.contains('lw-inline-prefs'))return;
 field(f,'src',(ft&&ft.src)||lt.src||'direct');field(f,'src_last',lt.src||'direct');field(f,'landing',ft&&ft.landing);field(f,'page',location.pathname);
 if(ref)field(f,'ref',ref.c);
 field(f,'utm_source',lt.utm_source);field(f,'utm_medium',lt.utm_medium);field(f,'utm_campaign',lt.utm_campaign)}
function tagAll(){[].forEach.call(document.forms,tag)}
// window-capture runs before lw.js's document-capture submit handler, so fields are present when it builds FormData
window.addEventListener('submit',function(e){var f=e.target;if(f&&f.tagName==='FORM'){tag(f);var a=f.getAttribute('action')||'';if(a.indexOf('formspree.io')>-1){var s=f.querySelector('input[name="source"]');track('signup_submit',{source:s?s.value:'',src:(ft&&ft.src)||''})}}},true);
// analytics
var Q=[];function track(n,d){try{if(window.umami&&umami.track){umami.track(n,d||{})}else if(Q.length<50)Q.push([n,d])}catch(e){}}
window.lwTrack=track;
function loadUmami(){if(!UMAMI_ID||!HOSTS.test(location.hostname))return;var s=document.createElement('script');s.defer=true;s.src=UMAMI_SRC;s.setAttribute('data-website-id',UMAMI_ID);s.setAttribute('data-domains','linewirehq.com,www.linewirehq.com');
 s.onload=function(){var t=setInterval(function(){if(window.umami&&umami.track){clearInterval(t);Q.splice(0).forEach(function(e){umami.track(e[0],e[1]||{})})}},300);setTimeout(function(){clearInterval(t)},8000)};document.head.appendChild(s)}
// auto events on tool pages: first real input = tool_use (once per page view); share buttons
function autos(){var tool=(document.querySelector('.isu input[name="source"]')||{}).value||'';var used=false,tm=null;
 var card=document.querySelector('main.tool .card');if(card)card.addEventListener('input',function(){if(used)return;clearTimeout(tm);tm=setTimeout(function(){used=true;track('tool_use',{tool:tool})},1200)});
 if(tool&&q.toString()&&/utm_source=share/.test(location.search))track('share_visit',{tool:tool});
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#copy,#share');if(b)track(b.id==='copy'?'share_copy':'share_native',{tool:tool})},true)}
function boot(){tagAll();autos();loadUmami()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
