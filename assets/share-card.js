/* Linewire branded result cards (client-side canvas → PNG). No network, no tracking beyond lwTrack if present.
   Usage: LWCard.share({tool:'Teaser calculator', verdict:'...', lines:['...','...'], url:'https://linewirehq.com/tools/x.html?...'}, buttonEl)
          LWCard.render(opts) -> <canvas 1200x630>   ·   LWCard.blob(opts) -> Promise<Blob> */
(function(){
var W=1200,H=630,G='#059669',GD='#047857',INK='#0b1513',BG='#f0fdf4';
var FONT='system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
function wrap(ctx,text,maxW){var words=String(text||'').split(/\s+/),lines=[],cur='';words.forEach(function(w){var t=cur?cur+' '+w:w;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);return lines}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function shortUrl(u){try{var p=new URL(u);return p.host.replace(/^www\./,'')+p.pathname.replace(/\.html$/,'')}catch(e){return 'linewirehq.com'}}
function render(o){o=o||{};var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
 x.fillStyle=BG;x.fillRect(0,0,W,H);x.fillStyle=G;x.fillRect(0,0,W,14);
 // header: wordmark + tool pill
 x.textBaseline='alphabetic';x.font='800 46px '+FONT;x.fillStyle=G;x.fillText('Linewire',64,96);
 var tool=String(o.tool||'Free tool');x.font='700 24px '+FONT;var tw=x.measureText(tool).width+36;rr(x,W-64-tw,58,tw,48,24);x.fillStyle='#d1fae5';x.fill();x.strokeStyle='#a7f3d0';x.lineWidth=2;x.stroke();x.fillStyle=GD;x.fillText(tool,W-64-tw+18,90);
 // verdict box
 var bx=64,by=136,bw=W-128,bh=300;rr(x,bx,by,bw,bh,22);x.fillStyle='#fff';x.fill();x.strokeStyle='#a7f3d0';x.lineWidth=2;x.stroke();x.fillStyle=o.neg?'#dc2626':G;x.fillRect(bx,by+22,10,bh-44);
 var fs=50,lines;do{x.font='800 '+fs+'px '+FONT;lines=wrap(x,o.verdict||'',bw-90);fs-=2}while((lines.length*fs*1.22>(o.lines&&o.lines.length?170:240))&&fs>24);
 x.fillStyle=o.neg?'#991b1b':'#064e3b';var ly=by+28+fs;lines.slice(0,5).forEach(function(l){x.fillText(l,bx+44,ly);ly+=fs*1.22});
 x.font='500 26px '+FONT;x.fillStyle='#374151';var dy=Math.max(ly+14,by+bh-((o.lines||[]).slice(0,3).length*36)-10);
 (o.lines||[]).slice(0,3).forEach(function(l){var t=wrap(x,l,bw-90)[0]||'';x.fillText(t,bx+44,dy);dy+=36});
 // footer
 x.font='800 34px '+FONT;x.fillStyle=INK;x.fillText(o.cta||'Run your own numbers free →',64,505);
 x.font='700 30px '+FONT;x.fillStyle=G;x.fillText(shortUrl(o.url||location.href),64,550);
 x.font='500 19px '+FONT;x.fillStyle='#6b7280';x.fillText('For information only, not betting advice · 21+ · Not available in all states · Gambling problem? 1-800-GAMBLER',64,598);
 return c}
function blob(o){return new Promise(function(res,rej){var c=render(o);if(c.toBlob)c.toBlob(function(b){b?res(b):rej(new Error('toBlob'))},'image/png');else{try{var d=atob(c.toDataURL('image/png').split(',')[1]),a=new Uint8Array(d.length);for(var i=0;i<d.length;i++)a[i]=d.charCodeAt(i);res(new Blob([a],{type:'image/png'}))}catch(e){rej(e)}}})}
function fname(o){return 'linewire-'+String(o.tool||'result').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.png'}
function msg(btn,m){if(!btn)return;var s=btn.parentNode&&btn.parentNode.querySelector('span');if(s){s.textContent=m;setTimeout(function(){s.textContent=''},3500)}}
function download(b,name){var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},1500)}
function share(o,btn){if(window.lwTrack)window.lwTrack('share_image',{tool:o.tool||''});return blob(o).then(function(b){var name=fname(o),f=null;try{f=new File([b],name,{type:'image/png'})}catch(e){}
 if(f&&navigator.canShare&&navigator.canShare({files:[f]})&&navigator.share){return navigator.share({files:[f],text:(o.text||o.verdict||'')+' '+(o.url||'')}).then(function(){msg(btn,'Shared ✓')},function(){})}
 download(b,name);msg(btn,'Image saved ✓ — post it anywhere')}).catch(function(){msg(btn,'Could not make the image on this browser')})}
window.LWCard={render:render,blob:blob,share:share};
})();
