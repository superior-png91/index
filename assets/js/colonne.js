/* La colonne Morris : affiches qui pivotent au défilement + ambiance de rue (passants, voitures, oiseaux, sons synthétisés) */
(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var FILMS=[
 {t:"Tempête sur l'échiquier",p:"assets/img/tempete-poster.webp",h:"Tableautempeteavecmusique.html"},
 {t:"Le Tableau des Fous",p:"assets/img/renaissance-poster.webp",h:"Tableaurenaissance.html"},
 {t:"Au fil des saisons",p:"assets/img/saisons-poster.webp",h:"Tableausaisonsavecmusique.html"},
 {t:"La 64ᵉ Dimension",p:"assets/img/machine-poster.webp",h:"Machinedutemps.html"}];
/* géométrie du fût dans la photo (pixels de l'image 1344×1792) */
var W=1344,HI=1792,CX=583,R=200,T0=563,TS=8,B0=1240,BS=8,RX0=CX-R-10,RY0=T0-2,RW=2*R+20,RH=(B0-T0)+4,
    CL=CX-R,CT=T0-2,CW=2*R,CH=(B0-T0)+4,
    C=2*Math.PI*R,H=B0-T0,N=FILMS.length,NS=2,NR=2,SLOT=C/NS,PH=320,ROWS=[12,345],TURNS=1.25,
    ORDER=[[0,1],[2,3]],ROWOFF=[0,SLOT/2],
    HZ=989,CAMH=1.25;               /* horizon et hauteur d'œil (en mètres) pour poser les passants */
var frm=document.querySelector(".mo-frame"),bg=$("moBG"),cv=$("moC"),cx=cv.getContext("2d"),am=$("moA"),ax=am.getContext("2d"),
    lab=$("moLab"),sec=$("morris"),btn=$("moSnd"),btnT=$("moSndT");
var shade=new Image(),spec=new Image(),posters=[],ld=0,need=3+N,strip,P,S,pctx,sctx,rot=0,dirtyC=true,vis=true;
var reduce=false;try{reduce=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.random()*a.length|0]}
function top(u){return T0+TS*u*u}
function bot(u){return B0-BS*u*u}
function done(){if(++ld<need)return;build();dirtyC=true;requestAnimationFrame(frame)}
var begun=false;
function begin(){   /* les images ne se chargent que lorsqu'on approche de la section */
  if(begun)return;begun=true;
  shade.onload=spec.onload=done;shade.src="assets/img/morris2-shade.webp?v=3";spec.src="assets/img/morris2-spec.webp?v=3";
  FILMS.forEach(function(f,i){var im=new Image();im.onload=done;im.src=f.p;posters[i]=im});
  bg.addEventListener("load",done,{once:true});bg.src=bg.getAttribute("data-src")}
if("IntersectionObserver" in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){begin();o.disconnect()}},{rootMargin:"900px 0px"}).observe(sec);else begin();
function mk(w,h){var c=document.createElement("canvas");c.width=w;c.height=h;return c}

/* ───────── les affiches, en bande à plat puis plaquées sur le cylindre ───────── */
var dirtyS=false,hl=null,lastPtr=null,FILT=(function(){try{var c=document.createElement('canvas').getContext('2d');return typeof c.filter==='string'}catch(e){return false}})();   /* affiche survolée : [rangée, position] */
/* titre du film, écrit sur l'affiche survolée : il est dans la bande à plat, donc il épouse la courbure du cylindre et tourne avec l'affiche */
function caption(g,t,xx,y,w){
  var fam='"Bodoni Moda",Georgia,serif',sz=36,bh=74,cxm=xx+w/2,by=y+PH-bh;
  g.save();
  var gr=g.createLinearGradient(0,by-18,0,y+PH);gr.addColorStop(0,"rgba(14,9,5,0)");gr.addColorStop(.45,"rgba(14,9,5,.78)");gr.addColorStop(1,"rgba(14,9,5,.9)");
  g.fillStyle=gr;g.fillRect(xx+2,by-18,w-4,bh+16);
  g.font="italic 600 "+sz+"px "+fam;while(sz>16&&g.measureText(t).width>w-64){sz-=2;g.font="italic 600 "+sz+"px "+fam}
  var tw=g.measureText(t).width,fs=((-rot)%C+C)%C,mid=xx+w/2;
  while(fs-mid>C/2)fs-=C;while(mid-fs>C/2)fs+=C;
  cxm=Math.min(Math.max(fs,xx+tw/2+30),xx+w-tw/2-30);   /* le titre suit la partie de l'affiche qui fait face */
  g.textAlign="center";g.textBaseline="middle";g.shadowColor="rgba(0,0,0,.9)";g.shadowBlur=8;g.fillStyle="#ffe8b0";g.fillText(t,cxm,y+PH-bh/2+2);
  g.restore()}
function drawStrip(){
  if(!strip)return;
  var SW=Math.ceil(C)+24,g=strip.getContext("2d");g.clearRect(0,0,SW,H);g.fillStyle="#2a2018";g.fillRect(0,0,SW,H);g.imageSmoothingQuality="high";   /* fond de panneau : cache l'affiche d'origine entre les nôtres */
  for(var r=0;r<NR;r++)for(var i=0;i<NS;i++){
    var f=ORDER[r][i],im=posters[f],w=PH*im.width/im.height,x=i*SLOT+(SLOT-w)/2+ROWOFF[r],y=ROWS[r],on=hl&&hl[0]===r&&hl[1]===i;
    for(var k=-1;k<=1;k++){var xx=x+k*C;if(xx>SW||xx+w<0)continue;
      g.globalAlpha=1;g.globalCompositeOperation="source-over";
      if(FILT){g.filter="brightness(1.22) contrast(1.14) saturate(1.12)";g.drawImage(im,xx,y,w,PH);g.filter="none"}
      else{g.drawImage(im,xx,y,w,PH);g.globalCompositeOperation="lighter";g.globalAlpha=.2;g.drawImage(im,xx,y,w,PH);g.globalAlpha=1;g.globalCompositeOperation="source-over"}
      if(on){
        g.globalCompositeOperation="lighter";g.globalAlpha=.5;g.drawImage(im,xx,y,w,PH);g.globalAlpha=.22;g.drawImage(im,xx,y,w,PH);   /* plus lumineuse, plus vive */
        g.globalCompositeOperation="source-over";g.globalAlpha=1;
        g.save();g.shadowColor="rgba(255,205,110,.95)";g.shadowBlur=16;g.strokeStyle="rgba(255,224,150,.98)";g.lineWidth=4;g.strokeRect(xx+2,y+2,w-4,PH-4);g.restore();
        g.strokeStyle="rgba(255,244,214,.9)";g.lineWidth=1.5;g.strokeRect(xx+4.5,y+4.5,w-9,PH-9)
        caption(g,FILMS[f].t,xx,y,w)}
      else{g.strokeStyle="rgba(10,8,6,.35)";g.lineWidth=1;g.strokeRect(xx+.5,y+.5,w-1,PH-1)}}}
  g.globalAlpha=1}
function build(){
  var SW=Math.ceil(C)+24;strip=mk(SW,H);drawStrip();
  P=mk(RW,RH);pctx=P.getContext("2d");pctx.imageSmoothingQuality="high";
  S=mk(RW,RH);sctx=S.getContext("2d")}
function layer(){
  pctx.clearRect(0,0,RW,RH);
  var x0=CX-R+1,x1=CX+R-1;
  for(var x=x0;x<x1;x++){
    var u=(x+.5-CX)/R,c=Math.sqrt(1-u*u),th=Math.asin(u),s=((R*th-rot)%C+C)%C,sw=Math.min(14,1/c),t=top(u),b=bot(u);
    var sx=s-sw/2;if(sx<0)sx+=C;
    pctx.drawImage(strip,sx,0,sw,H,x-RX0,t-RY0,1,b-t)}
  sctx.globalCompositeOperation="source-over";sctx.clearRect(0,0,RW,RH);
  sctx.drawImage(shade,0,0);
  sctx.globalCompositeOperation="multiply";sctx.drawImage(P,0,0);
  sctx.globalCompositeOperation="screen";sctx.drawImage(spec,0,0);
  sctx.globalCompositeOperation="destination-in";sctx.drawImage(P,0,0);
  sctx.globalCompositeOperation="source-over"}
function drawColumn(){
  layer();cx.clearRect(0,0,CW,CH);
  cx.drawImage(bg,CL,CT,CW,CH,0,0,CW,CH);       /* le fût de la photo : cache ce qui passe derrière */
  cx.drawImage(S,RX0-CL,RY0-CT)}                  /* puis les affiches, éclairées */

/* ───────── ombres chinoises : passants, chiens et oiseaux en silhouette (derrière la colonne) ───────── */
var INK="#140e09";
var walkers=[],birds=[],tW=0,tB=0,lastT=0;
function spawnWalker(dir,x,s,sp){
  var k=Math.random(),dress=Math.random()<.38,o={dir:dir,s:s||rnd(46,66),x:x!=null?x:(dir>0?-110:W+110),ph:rnd(0,6.28),hh:rnd(1.62,1.84),
    dress:dress,hat:dress?pick(["none","beret","bun","none"]):pick(["top","cap","none","none","beret"]),
    item:dress?pick(["umbrella","bag","none","bag"]):pick(["cane","bag","umbrella","none","none"]),dog:Math.random()<.22};
  o.sp=sp||rnd(1.05,1.4)*o.s;walkers.push(o);return o}
function spawnBirds(){
  var n=1+(Math.random()<.45?1+(Math.random()<.5?1:0):0),dir=Math.random()<.5?1:-1,y=rnd(70,380),sz=rnd(13,22),sp=rnd(95,170);
  for(var i=0;i<n;i++)birds.push({dir:dir,x:(dir>0?-40:W+40)-dir*i*rnd(40,80),y:y+rnd(-26,26)+i*rnd(8,22),sz:sz*rnd(.85,1.1),sp:sp*rnd(.94,1.06),ph:rnd(0,6.28),f:rnd(7,10),dy:rnd(-9,9)})}
function seed(){
  spawnWalker(1,rnd(80,360));spawnWalker(-1,rnd(760,1200));
  var c=spawnWalker(1,rnd(520,700));var c2=spawnWalker(1,c.x-.6*c.s,c.s,c.sp);c2.dress=true;c2.hat="bun";c2.item="bag";c2.dog=false;
  birds.length=0;spawnBirds();birds.forEach(function(b){b.x=b.dir>0?rnd(120,700):rnd(640,1220)});
  tW=rnd(2,4);tB=rnd(6,12)}
function step(dt){
  tW-=dt;tB-=dt;
  if(tW<=0&&walkers.length<7){tW=rnd(2.6,6);var d=Math.random()<.5?1:-1,w=spawnWalker(d);
    if(Math.random()<.3){var w2=spawnWalker(d,w.x-d*rnd(.55,.75)*w.s,w.s*rnd(.97,1.03),w.sp);w2.hh=rnd(1.55,1.8);w2.dog=false}}
  if(tB<=0&&birds.length<5){tB=rnd(10,22);spawnBirds()}
  var i,o;
  for(i=walkers.length-1;i>=0;i--){o=walkers[i];o.x+=o.dir*o.sp*dt;if(o.x<-220||o.x>W+220)walkers.splice(i,1)}
  for(i=birds.length-1;i>=0;i--){o=birds[i];o.x+=o.dir*o.sp*dt;o.ph+=o.f*dt;o.y+=o.dy*dt*.5;if(o.x<-120||o.x>W+120)birds.splice(i,1)}}
function limb(g,x0,y0,x1,y1,x2,y2,w0,w1){g.lineWidth=w0;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.lineWidth=w1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
function dog(g,x,fy,sz,ph,dr){
  var L=.55*sz,Hd=.42*sz,sw=Math.sin(ph)*.55;
  g.save();g.translate(x,fy);g.scale(dr,1);g.fillStyle=g.strokeStyle=INK;g.lineCap="round";g.lineJoin="round";
  g.beginPath();g.ellipse(0,-Hd*.66,L*.5,Hd*.2,0,0,6.3);g.fill();                       /* corps */
  g.beginPath();g.moveTo(L*.38,-Hd*.78);g.lineTo(L*.62,-Hd*1.0);g.lineTo(L*.62,-Hd*.78);g.closePath();g.fill();  /* cou */
  g.beginPath();g.ellipse(L*.66,-Hd*.98,L*.1,Hd*.1,0,0,6.3);g.fill();                       /* tête */
  g.beginPath();g.moveTo(L*.72,-Hd*.98);g.lineTo(L*.84,-Hd*.92);g.lineTo(L*.72,-Hd*.88);g.closePath();g.fill();  /* museau */
  g.beginPath();g.moveTo(L*.6,-Hd*1.05);g.lineTo(L*.56,-Hd*.82);g.lineTo(L*.66,-Hd*.9);g.closePath();g.fill();  /* oreille */
  g.lineWidth=Hd*.07;g.beginPath();g.moveTo(-L*.46,-Hd*.7);g.quadraticCurveTo(-L*.62,-Hd*.9,-L*.6,-Hd*1.05);g.stroke();  /* queue */
  g.lineWidth=Hd*.09;
  [[-.34,0],[-.28,Math.PI],[.3,Math.PI],[.36,0]].forEach(function(l){var a=Math.sin(ph+l[1])*.6;g.beginPath();g.moveTo(L*l[0],-Hd*.55);g.lineTo(L*l[0]+Math.sin(a)*Hd*.45,-Hd*.05*Math.cos(a));g.stroke()});
  g.restore()}
function person(g,o){
  var h=o.hh*o.s,fy=HZ+CAMH*o.s,x=o.x,dr=o.dir,ph=o.ph+o.x*dr/(1.5*o.s)*6.2832,sw=Math.sin(ph)*.36,cs=Math.cos(ph),
      bob=Math.abs(Math.sin(ph))*.014*h,hip=fy-.5*h+bob,sh=fy-.82*h+bob,hd=fy-.925*h+bob,r=.055*h,nx=x+dr*.02*h,hx=nx+dr*.01*h,i,a,sg,kx,ky,fx,fyy,hxA=0,hyA=0;
  g.lineCap="round";g.lineJoin="round";g.fillStyle=g.strokeStyle=INK;
  /* ombre portée, longue, vers la droite */
  g.save();g.fillStyle="rgba(24,14,5,.30)";g.beginPath();g.moveTo(x-.05*h,fy);g.lineTo(x+.05*h,fy);g.lineTo(x+1.1*h,fy+.05*h);g.lineTo(x+.9*h,fy+.05*h);g.closePath();g.fill();g.restore();
  /* petit compagnon à quatre pattes */
  if(o.dog){var dx=x+dr*.95*o.s;dog(g,dx,fy+.02*o.s,.85*o.s,ph*1.6,dr);g.lineWidth=Math.max(1,.006*h);g.beginPath();g.moveTo(nx+dr*.25*h*.5,sh+.38*h);g.lineTo(dx+dr*.2*o.s,fy-.2*o.s);g.stroke()}
  /* jambes */
  for(i=0;i<2;i++){sg=i?-1:1;a=dr*sg*sw;var kb=.6*Math.max(0,dr*sg*cs);
    kx=x+Math.sin(a)*.245*h;ky=hip+Math.cos(a)*.245*h;fx=kx+Math.sin(a-dr*kb)*.245*h;fyy=ky+Math.cos(a-dr*kb)*.245*h;
    if(!(o.dress&&i===1&&false)){limb(g,x,hip,kx,ky,fx,fyy,.078*h,.056*h);g.beginPath();g.ellipse(fx+dr*.03*h,fyy,.06*h,.022*h,0,0,6.3);g.fill()}}
  /* buste */
  if(o.dress){g.beginPath();g.moveTo(nx-.07*h,sh);g.lineTo(nx+.07*h,sh);g.lineTo(x+.085*h,hip-.02*h);g.quadraticCurveTo(x+.15*h,hip+.2*h,x+.14*h,fy-.1*h);g.lineTo(x-.14*h,fy-.1*h);g.quadraticCurveTo(x-.15*h,hip+.2*h,x-.085*h,hip-.02*h);g.closePath();g.fill()}
  else{g.lineWidth=.15*h;g.beginPath();g.moveTo(x,hip-.01*h);g.lineTo(nx,sh+.03*h);g.stroke();
    g.beginPath();g.moveTo(x-.08*h,hip);g.lineTo(x+.08*h,hip);g.lineTo(x+.095*h,hip+.19*h);g.lineTo(x-.095*h,hip+.19*h);g.closePath();g.fill()}
  /* bras */
  for(i=0;i<2;i++){sg=i?-1:1;a=-dr*sg*sw*1.1;var ex=nx+Math.sin(a)*.17*h,ey=sh+.04*h+Math.cos(a)*.17*h,ax=ex+Math.sin(a+dr*.35)*.17*h,ay=ey+Math.cos(a+dr*.35)*.17*h;
    if(i===1&&(o.item==="cane"||o.item==="umbrella")){ax=nx+dr*.16*h;ay=sh+.30*h;ex=nx+dr*.05*h;ey=sh+.2*h}
    limb(g,nx,sh+.04*h,ex,ey,ax,ay,.05*h,.04*h);
    if(i===1){hxA=ax;hyA=ay}}
  /* accessoires tenus en main */
  if(o.item==="cane"){g.lineWidth=.016*h;g.beginPath();g.moveTo(hxA-dr*.02*h,hyA-.02*h);g.lineTo(hxA+dr*.05*h,fy);g.stroke()}
  else if(o.item==="umbrella"){var ux=hxA,uy=hd-.19*h;g.lineWidth=.014*h;g.beginPath();g.moveTo(ux,hyA);g.lineTo(ux,uy);g.stroke();
    g.beginPath();g.moveTo(ux-.25*h,uy);g.quadraticCurveTo(ux,uy-.2*h,ux+.25*h,uy);g.quadraticCurveTo(ux+.125*h,uy+.025*h,ux,uy+.0*h);g.quadraticCurveTo(ux-.125*h,uy+.025*h,ux-.25*h,uy);g.fill()}
  else if(o.item==="bag"){g.beginPath();g.rect(hxA-.05*h,hyA,.1*h,.085*h);g.fill()}
  /* tête, profil avec le nez */
  g.fillRect(nx-.017*h,hd+.02*h,.034*h,.07*h);
  g.beginPath();g.arc(hx,hd,r,0,6.3);g.fill();
  g.beginPath();g.moveTo(hx+dr*r*.85,hd-.15*r);g.lineTo(hx+dr*r*1.38,hd+.3*r);g.lineTo(hx+dr*r*.8,hd+.42*r);g.closePath();g.fill();
  if(o.hat==="top"){g.fillRect(hx-r*1.1,hd-r*.95,r*2.2,r*.26);g.fillRect(hx-r*.72,hd-r*2.35,r*1.44,r*1.45)}
  else if(o.hat==="cap"){g.beginPath();g.arc(hx,hd-r*.15,r*1.12,Math.PI,0);g.fill();g.beginPath();g.moveTo(hx+dr*r*.7,hd-r*.35);g.lineTo(hx+dr*r*1.7,hd-r*.1);g.lineTo(hx+dr*r*.7,hd-r*.05);g.closePath();g.fill()}
  else if(o.hat==="beret"){g.beginPath();g.ellipse(hx-dr*r*.15,hd-r*.85,r*1.45,r*.5,dr*.18,0,6.3);g.fill();g.fillRect(hx-dr*r*.15-r*.08,hd-r*1.45,r*.16,r*.3)}
  else if(o.hat==="bun"){g.beginPath();g.arc(hx-dr*r*.95,hd-r*.2,r*.62,0,6.3);g.fill()}}
function bird(g,o){
  var a=Math.sin(o.ph)*.8,z=o.sz,x=o.x,y=o.y;
  g.strokeStyle=INK;g.lineWidth=z*.2;g.lineCap="round";g.lineJoin="round";
  g.beginPath();g.moveTo(x-z,y-a*z);g.quadraticCurveTo(x-z*.45,y-a*z*.9-z*.28,x,y);g.quadraticCurveTo(x+z*.45,y-a*z*.9-z*.28,x+z,y-a*z);g.stroke();
  g.fillStyle=INK;g.beginPath();g.ellipse(x+o.dir*z*.15,y+z*.05,z*.3,z*.14,0,0,6.3);g.fill()}
function drawAmbient(){
  ax.setTransform(1,0,0,1,0,0);ax.clearRect(0,0,am.width,am.height);ax.scale(am.width/W,am.width/W);
  walkers.slice().sort(function(a,b){return a.s-b.s}).forEach(function(o){person(ax,o)});
  birds.forEach(function(o){bird(ax,o)})}

/* ───────── les sons : une vraie ambiance de rue (oiseaux, ville), jouée en boucle sans raccord ───────── */
var AC=null,master,srcNode=null,buf=null,loading=false,on=false,userOff=false,scrolled=false;
function setBtn(){
  btn.setAttribute("aria-pressed",on?"true":"false");
  btn.setAttribute("aria-label",on?"Couper l'ambiance sonore de la rue":"Activer l'ambiance sonore de la rue");
  btnT.textContent=on?"Son":"Ambiance"}
function initAudio(){
  if(AC)return true;var Cx=window.AudioContext||window.webkitAudioContext;if(!Cx)return false;
  try{AC=new Cx()}catch(e){AC=null;return false}
  master=AC.createGain();master.gain.value=0;master.connect(AC.destination);return true}
function loadBuf(cb){
  if(buf){cb();return}if(loading)return;loading=true;
  fetch("assets/audio/ambiance-rue.mp3?v=2").then(function(r){return r.arrayBuffer()}).then(function(ab){
    return new Promise(function(ok,ko){AC.decodeAudioData(ab,ok,ko)})}).then(function(d){buf=d;loading=false;cb()}).catch(function(){loading=false})}
function play(){
  if(srcNode||!buf)return;srcNode=AC.createBufferSource();srcNode.buffer=buf;srcNode.loop=true;
  var g=AC.createGain();g.gain.value=1.5;srcNode.connect(g);g.connect(master);srcNode.start()}
function audible(){return on&&vis&&!document.hidden}
function applyGain(){if(AC&&master)master.gain.setTargetAtTime(audible()?1:0,AC.currentTime,.4)}
function turnOn(){
  if(!initAudio())return;
  var r=AC.resume();(r&&r.then?r:Promise.resolve()).then(function(){
    if(AC.state!=="running"||userOff)return;
    loadBuf(function(){if(userOff||on)return;play();on=true;setBtn();applyGain()})},function(){})}
function startAudio(){if(userOff||on)return;turnOn()}
function arm(){
  var go=function(){["pointerdown","keydown","touchend"].forEach(function(e){removeEventListener(e,go,true)});if(scrolled)startAudio()};
  ["pointerdown","keydown","touchend"].forEach(function(e){addEventListener(e,go,true)})}
btn.addEventListener("click",function(){
  btn.classList.remove("hint");
  if(on){userOff=true;on=false;setBtn();applyGain();return}
  userOff=false;turnOn()});
document.addEventListener("visibilitychange",applyGain);
setBtn();arm();

/* ───────── défilement, survol, clic ───────── */
function onScroll(){
  var r=sec.getBoundingClientRect(),h=r.height-innerHeight,p=h>0?Math.min(1,Math.max(0,-r.top/h)):0;
  var nr=p*C*TURNS;if(Math.abs(nr-rot)>.05){rot=nr;dirtyC=true;if(lastPtr)setHot(hit(lastPtr));if(hl)dirtyS=true}
  var v=r.bottom>0&&r.top<innerHeight;if(v!==vis){vis=v;applyGain()}
  if(!scrolled&&r.top<-20){scrolled=true;startAudio();if(!on)btn.classList.add("hint")}}
addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);onScroll();
function frame(ts){
  requestAnimationFrame(frame);
  if(dirtyS&&vis){dirtyS=false;drawStrip()}
  if(dirtyC&&vis){dirtyC=false;drawColumn()}
  var dt=Math.min(.05,(ts-lastT)/1000||0);lastT=ts;
  if(reduce||!vis||document.hidden)return;
  if(!(window.__mo&&window.__mo.freeze))step(dt);drawAmbient()}
if(!reduce)seed();
function hit(ev){
  if(!strip)return null;
  var b=frm.getBoundingClientRect(),X=(ev.clientX-b.left)*W/b.width,Y=(ev.clientY-b.top)*HI/b.height,u=(X-CX)/R;
  if(Math.abs(u)>=.985)return null;
  var t=top(u),bb=bot(u);if(Y<t||Y>bb)return null;
  var s=((R*Math.asin(u)-rot)%C+C)%C,v=(Y-t)/(bb-t)*H;
  for(var r=0;r<NR;r++){if(v<ROWS[r]||v>ROWS[r]+PH)continue;
    for(var i=0;i<NS;i++){var im=posters[ORDER[r][i]],w=PH*im.width/im.height,x=i*SLOT+(SLOT-w)/2+ROWOFF[r];
      for(var k=-1;k<=1;k++){var xx=x+k*C;if(s>=xx&&s<=xx+w)return [r,i]}}}
  return null}
function setHot(h){
  var same=(!h&&!hl)||(h&&hl&&h[0]===hl[0]&&h[1]===hl[1]);if(same)return;
  hl=h;drawStrip();dirtyC=true;
  var f=h?ORDER[h[0]][h[1]]:-1;
  frm.style.cursor=h?"pointer":"";lab.textContent=h?FILMS[f].t:""}
frm.addEventListener("pointermove",function(e){lastPtr={clientX:e.clientX,clientY:e.clientY};setHot(hit(e))});
frm.addEventListener("pointerleave",function(){lastPtr=null;setHot(null)});
frm.addEventListener("click",function(e){if(e.target.closest&&e.target.closest(".mo-snd"))return;var h=hit(e);if(h)location.href=FILMS[ORDER[h[0]][h[1]]].h});
if(/[?&]debug/.test(location.search))window.__mo={get ac(){return AC},get on(){return on},walkers:walkers,birds:birds,spawnBirds:spawnBirds,spawnWalker:spawnWalker,startAudio:startAudio,get master(){return master}};
})();
