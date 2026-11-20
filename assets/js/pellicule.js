/* La pellicule qu'on tire : section « Les films du club » de la page d'accueil.
   Image réaliste (table + bande) ; la bande coulisse hors de la cartouche en suivant sa courbe. */
(function(){
var root=document.getElementById("pellicule");if(!root)return;
var FILMS=[{t:"Tempête sur l'échiquier",p:"assets/img/tempete-poster.webp",h:"Tableautempeteavecmusique.html"},
 {t:"Le Tableau des Fous",p:"assets/img/renaissance-poster.webp",h:"Tableaurenaissance.html"},
 {t:"Au fil des saisons",p:"assets/img/saisons-poster.webp",h:"Tableausaisonsavecmusique.html"},
 {t:"La 64ᵉ Dimension",p:"assets/img/machine-poster.webp",h:"Machinedutemps.html"}];
var G={"L":1677.6849336131481,"HF":400,"X0":531,"xs":[531,541,551,561,571,581,591,601,611,621,631,641,651,661,671,681,691,701,711,721,731,741,751,761,771,781,791,801,811,821,831,841,851,861,871,881,891,901,911,921,931,941,951,961,971,981,991,1001,1011,1021,1031,1041,1051,1061,1071,1081,1091,1101,1111,1121,1131,1141,1151,1161,1171,1181,1191,1201,1211,1221,1231,1241,1251,1261,1271,1281,1291,1301,1311,1321,1331,1341,1351,1361,1371,1381,1391,1401,1411,1421,1431,1441,1451,1461,1471,1481,1491,1501,1511,1521,1531,1541,1551,1561,1571,1581,1591,1601,1611,1621,1631,1641,1651,1661,1671,1681,1691,1701,1711,1721,1731,1741,1751,1761,1771,1781,1791,1801,1811,1821,1831,1841,1851,1861,1871,1881,1891,1901,1911,1921,1931,1941,1951,1961,1971,1981,1991,2001,2011,2021,2031,2041,2051,2061,2071,2081,2091,2101,2111],"top":[391.9,387.4,386.9,385.8,384.4,380.2,379.9,379.0,378.6,374.9,373.9,373.0,372.2,374.0,373.0,373.0,373.0,372.8,372.0,372.0,372.0,371.9,371.9,372.6,373.6,374.1,376.0,376.0,377.0,378.7,381.0,383.0,385.0,387.4,389.5,392.3,395.1,398.3,401.3,404.7,408.2,412.0,416.0,420.4,424.3,428.9,433.8,438.8,443.8,449.0,454.3,459.8,465.6,471.4,477.4,483.2,489.3,495.3,501.2,508.1,515.0,520.7,527.0,532.5,538.9,544.0,550.3,555.5,560.2,565.3,570.4,575.2,580.0,584.6,589.2,593.6,597.7,601.8,605.8,609.8,613.4,617.2,620.7,624.0,627.3,630.7,634.0,636.7,640.0,642.6,645.3,647.9,651.0,652.9,655.4,657.6,659.8,662.1,664.0,666.4,667.9,669.4,671.2,672.6,674.4,675.6,676.8,677.9,679.0,680.1,682.0,682.0,683.0,683.0,684.0,684.8,685.0,685.0,685.4,686.0,686.0,686.0,685.6,685.0,685.0,684.9,684.0,683.1,683.0,682.9,681.0,679.9,679.0,678.0,676.8,675.1,672.9,671.2,669.6,667.2,665.9,663.4,660.9,658.4,655.9,653.1,650.3,647.1,644.2,641.0,638.0,634.0,630.3,626.4,622.6,618.7,614.6,610.2,603.6],"bot":[748.9,758.1,758.0,756.6,755.0,753.8,752.2,751.0,749.6,748.1,747.0,745.9,744.6,743.6,742.6,741.9,741.0,741.0,741.0,741.0,740.8,740.1,741.0,742.6,743.1,744.2,746.2,747.0,749.1,750.9,753.2,755.6,758.4,761.6,764.7,768.3,772.0,776.0,780.0,784.2,788.7,793.1,798.1,802.7,807.9,813.5,819.1,824.5,830.2,835.6,841.4,846.9,853.1,858.7,864.2,870.0,875.3,883.3,887.5,891.1,898.3,901.3,906.2,911.6,917.0,922.9,927.0,932.0,936.7,939.6,944.4,948.5,953.0,956.7,960.3,964.1,968.6,971.8,977.6,979.4,981.3,988.2,991.7,995.0,998.3,1001.5,1004.7,1007.8,1010.9,1014.0,1017.0,1019.8,1022.6,1018.0,1025.4,1030.1,1032.4,1034.5,1036.5,1038.3,1040.0,1041.6,1043.0,1044.3,1045.5,1046.5,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1047.0,1046.0,1045.1,1044.6,1043.9,1043.0,1042.0,1041.1,1040.6,1039.9,1039.0,1037.9,1036.3,1034.7,1030.0,1028.4,1027.0,1027.6,1023.0,1020.1,1018.1,1017.1,1017.7,1015.5,1013.3,1011.0,1008.6,1005.9,1003.0,997.4,995.2,992.1,988.0,983.1,977.7,971.6,961.9,955.3,951.1,944.2,937.9,933.0],"S":[0.0,10.4,20.4,30.5,40.6,51.0,61.1,71.1,81.2,91.6,101.6,111.7,121.8,131.9,142.0,152.0,162.0,172.0,182.0,192.0,202.0,212.1,222.1,232.2,242.2,252.2,262.4,272.5,282.6,292.8,303.0,313.3,323.6,333.9,344.3,354.8,365.3,376.0,386.6,397.2,408.0,418.8,429.8,440.8,451.8,463.0,474.3,485.6,496.9,508.2,519.7,531.1,542.8,554.3,565.8,577.4,588.9,601.1,612.4,623.7,636.0,646.9,658.4,669.8,681.4,692.9,704.2,715.4,726.5,737.3,748.4,759.4,770.4,781.3,792.1,802.9,813.8,824.5,835.8,846.2,856.6,868.2,878.8,889.3,899.8,910.4,920.9,931.3,941.8,952.2,962.6,973.0,983.4,994.0,1005.8,1016.7,1027.0,1037.2,1047.4,1057.6,1067.8,1077.9,1088.0,1098.1,1108.2,1118.3,1128.3,1138.4,1148.4,1158.4,1168.4,1178.4,1188.5,1198.5,1208.5,1218.5,1228.5,1238.5,1248.5,1258.5,1268.5,1278.6,1288.6,1298.6,1308.6,1318.6,1328.7,1338.7,1348.8,1358.8,1369.0,1379.6,1389.7,1399.8,1409.9,1420.5,1430.8,1441.0,1451.1,1461.3,1471.5,1481.7,1492.0,1502.3,1512.7,1523.0,1534.1,1544.6,1555.0,1565.7,1576.4,1587.5,1598.6,1611.0,1622.4,1633.2,1644.6,1655.9,1667.5],"frames":[[14,292,0.175,0.825,14,292,14,292],[319,679,0.175,0.825,344,679,319,662],[674,1142,0.175,0.825,714,1142,674,1129],[1158,1639,0.175,0.825,1178,1639,1158,1639]]},N=FILMS.length,L=G.L,HF=G.HF,X0=G.X0;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
var NX=2120-X0,Tp=[],Bp=[],Sp=[];
for(var i=0;i<NX;i++){var f=i/10,a=Math.floor(f),w=f-a,b=Math.min(a+1,G.top.length-1);a=Math.min(a,G.top.length-1);
 Tp[i]=G.top[a]*(1-w)+G.top[b]*w;Bp[i]=G.bot[a]*(1-w)+G.bot[b]*w;Sp[i]=G.S[a]*(1-w)+G.S[b]*w}
function xOfS(s){var lo=0,hi=NX-1;while(lo<hi){var m=(lo+hi)>>1;if(Sp[m]<s)lo=m+1;else hi=m}return lo}
var view=root.querySelector(".pl-view"),sizer=root.querySelector(".pl-sizer"),scene=root.querySelector(".pl-scene"),lab=root.querySelector(".pl-lab"),tip=root.querySelector(".pl-tip"),tg=root.querySelector(".pl-b");
var cv=document.createElement("canvas"),rf=document.createElement("canvas"),gl=document.createElement("canvas");rf.className="pl-refl";gl.className="pl-glow";
var CX=520,CY=350,CW=1640,CH=830;
[gl,rf,cv].forEach(function(c){c.width=CW;c.height=CH;c.style.left=CX+"px";c.style.top=CY+"px";c.style.width=CW+"px";c.style.height=CH+"px";c.setAttribute("aria-hidden","true");scene.appendChild(c)});
var cx=cv.getContext("2d"),rx=rf.getContext("2d"),gx=gl.getContext("2d");
var texImg=new Image(),posters=[],ld=0,texT,texC,started=false,vis=false,ready=false;
function done(){if(++ld==N+1){build();ready=true;fit();if(vis)begin()}}
texImg.onload=done;texImg.src="assets/img/pellicule-bande.webp";
FILMS.forEach(function(f,i){var im=new Image();im.onload=done;im.src=f.p;posters[i]=im});
function mk(){var c=document.createElement("canvas");c.width=Math.ceil(L)+2;c.height=HF;return c}
function build(){texT=mk();texC=mk();var a=texT.getContext("2d"),b=texC.getContext("2d");a.drawImage(texImg,0,0);b.drawImage(texImg,0,0);
 G.frames.forEach(function(fr,i){var v0=fr[2]*HF,v1=fr[3]*HF,h=v1-v0,im=posters[i],ur=Math.max(fr[5]-fr[4],fr[7]-fr[6]),r=ur/h,ir=im.width/im.height,sw,sh;
  if(ir>r){sh=im.height;sw=sh*r}else{sw=im.width;sh=sw/r}
  [a,b].forEach(function(c,k){c.save();c.beginPath();c.moveTo(fr[4],v0);c.lineTo(fr[5],v0);c.lineTo(fr[7],v1);c.lineTo(fr[6],v1);c.closePath();c.clip();
   var x=fr[4],w=ur,sk=((fr[6]-fr[4])+(fr[7]-fr[5]))/2/h;
   c.transform(1,0,sk,1,-sk*v0,0);
   c.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,x,v0,w,h);
   c.setTransform(1,0,0,1,0,0);
   c.beginPath();c.moveTo(fr[4],v0);c.lineTo(fr[5],v0);c.lineTo(fr[7],v1);c.lineTo(fr[6],v1);c.closePath();
   if(k==0){c.globalCompositeOperation="multiply";c.fillStyle="#ffdcb4";c.fill();c.globalCompositeOperation="screen";c.fillStyle="rgba(80,36,10,.20)";c.fill();c.globalCompositeOperation="source-over"}
   else{c.globalCompositeOperation="screen";c.fillStyle="rgba(40,24,10,.07)";c.fill();c.globalCompositeOperation="source-over"}
   var g=c.createLinearGradient(0,v0,0,v1);g.addColorStop(0,"rgba(255,200,140,.14)");g.addColorStop(.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.10)");c.fillStyle=g;c.fill();c.restore()})});
 [a,b].forEach(function(c){c.globalCompositeOperation="source-atop";var t=c.createLinearGradient(0,0,0,HF);t.addColorStop(0,"rgba(255,190,120,.16)");t.addColorStop(.05,"rgba(255,190,120,0)");t.addColorStop(.95,"rgba(0,0,0,0)");t.addColorStop(1,"rgba(0,0,0,.22)");c.fillStyle=t;c.fillRect(0,0,texT.width,HF);c.globalCompositeOperation="source-over"})}
var K=.48,VX=150,Y0=240,Y1=1110;
function fit(){var W=Math.min(root.clientWidth,1280),narrow=W<700;
 if(narrow){VX=160;Y0=250;Y1=1090;K=W/2060}else{VX=150;Y0=240;Y1=1110;K=W/2080}
 sizer.style.width=W+"px";sizer.style.height=((Y1-Y0)*K)+"px";scene.style.transform="translate("+(-VX*K)+"px,"+(-Y0*K)+"px) scale("+K+")"}
addEventListener("resize",fit);
var d=0,vel=0,hov=[0,0,0,0],hot=-1,seq=null,drag=null,touched=false,lastT=0,lastD=0,raf=0;
function ease(t){return 1-Math.pow(1-t,3)}
function tugs(from){var T=[.2,.45,.7,1],steps=[],t=performance.now()+300,cur=from;T.forEach(function(g){if(g<=cur)return;steps.push({a:cur,b:g,t0:t,t1:t+1050});t+=1050+420;cur=g});seq=steps}
function retract(){var t=performance.now();seq=[{a:d/L,b:0,t0:t,t1:t+1900,sm:1}]}
function stepSeq(t){if(!seq||!seq.length)return;var s=seq[0];if(t<s.t0)return;var k=Math.min(1,(t-s.t0)/(s.t1-s.t0));d=(s.a+(s.b-s.a)*(s.sm?(k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2):ease(k)))*L;if(k>=1){seq.shift();if(!seq.length)seq=null}}
function render(t){cx.clearRect(0,0,CW,CH);rx.clearRect(0,0,CW,CH);gx.clearRect(0,0,CW,CH);if(d<2)return;
 var xh=Math.min(NX-1,xOfS(d)),wob=Math.min(1,Math.abs(vel)/.9)*5,off=L-d,seg=2;
 for(var i=0;i<=xh;i+=seg){var s=Sp[i],u=s+off,i2=Math.min(NX-1,i+seg),ds=Sp[i2]-s+.4,y=Math.sin(s*.017-t*.012)*wob*Math.min(1,s/500),top=Tp[i]+y,h=Bp[i]-Tp[i];
  var f=-1;for(var q=0;q<N;q++){var fr=G.frames[q];if(u>=fr[0]&&u<=fr[1]){f=q;break}}
  var dx=X0+i-CX,dy=top-CY;cx.drawImage(texT,u,0,ds,HF,dx,dy,seg+.7,h);
  if(f>=0&&hov[f]>.01){cx.globalAlpha=hov[f];cx.drawImage(texC,u,0,ds,HF,dx,dy,seg+.7,h);cx.globalAlpha=1}
  var TH=5;cx.fillStyle="rgba(150,70,25,.75)";cx.fillRect(dx,dy+h-1,seg+.7,2);cx.fillStyle="rgba(40,16,6,.55)";cx.fillRect(dx,dy+h+1,seg+.7,3);
  cx.fillStyle="rgba(255,206,140,.35)";cx.fillRect(dx,dy-1,seg+.7,1.5);
  if(i+seg>xh){cx.fillStyle="rgba(90,40,14,.8)";cx.fillRect(dx+seg,dy+2,3,h+TH-2)}
  rx.fillStyle="rgba(0,0,0,.8)";rx.fillRect(dx,dy+h+2,seg+.7,40);rx.fillStyle="rgba(0,0,0,.6)";rx.fillRect(dx+10,dy+h+30,seg+.7,26)}
 rx.save();rx.scale(1,-1);
 for(var j=0;j<=xh;j+=seg){var s2=Sp[j],u2=s2+off,dd=Sp[Math.min(NX-1,j+seg)]-s2+.4,h2=Bp[j]-Tp[j],hr=h2*.3,yb=Tp[j]+h2+20-CY;
  rx.drawImage(texT,u2,0,dd,HF,X0+j-CX,-(yb+hr),seg+.7,hr)}
 rx.restore()}
function frame(t){if(!vis){raf=0;return}
 var dt=Math.min(60,t-(lastT||t));lastT=t;stepSeq(t);vel=dt?(d-lastD)/dt:0;lastD=d;
 for(var i=0;i<N;i++)hov[i]+=((i==hot&&d>L*.97?1:0)-hov[i])*.14;
 render(t);
 var xh=xOfS(Math.max(d,1)),show=(!touched&&!seq&&d>L*.97);tip.style.opacity=show?1:0;
 if(show){tip.style.left=(((X0+xh)-VX)*K-70)+"px";tip.style.top=(((Tp[xh]+Bp[xh])/2-Y0)*K-8)+"px"}
 raf=requestAnimationFrame(frame)}
function begin(){if(started)return;started=true;if(reduce){d=L}else{tugs(0)}updateBtn()}
function loop(){if(!raf&&ready&&vis){lastT=0;raf=requestAnimationFrame(frame)}}
if("IntersectionObserver" in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis){if(ready)begin();loop()}},{threshold:.3}).observe(root)}
else{vis=true}
/* souris / doigt */
function scenePt(e){var r=sizer.getBoundingClientRect();return [(e.clientX-r.left)/K+VX,(e.clientY-r.top)/K+Y0]}
function hit(p){var x=p[0]-X0,y=p[1];if(d<2||x<0||x>NX-1)return null;var i=Math.floor(x);if(i>xOfS(d))return null;var s=Sp[i],u=s+L-d,h=Bp[i]-Tp[i],v=(y-Tp[i])/h;if(v<-.04||v>1.04)return null;
 var f=-1;for(var q=0;q<N;q++){var fr=G.frames[q];if(u>=fr[0]&&u<=fr[1]&&v>=fr[2]&&v<=fr[3]){f=q;break}}return {f:f}}
sizer.addEventListener("pointermove",function(e){if(!ready)return;var p=scenePt(e);
 if(drag){var ddx=(e.clientX-drag.x)/K;drag.x=e.clientX;drag.moved+=Math.abs(ddx);d=Math.max(0,Math.min(L,d+ddx*1.02));return}
 var h=hit(p);hot=h?h.f:-1;lab.textContent=hot>=0&&d>L*.97?FILMS[hot].t:"";sizer.style.cursor=h?"grab":""});
sizer.addEventListener("pointerdown",function(e){if(!ready)return;var h=hit(scenePt(e));if(!h)return;drag={x:e.clientX,moved:0,f:h.f};touched=true;seq=null;try{sizer.setPointerCapture(e.pointerId)}catch(x){}sizer.style.cursor="grabbing"});
sizer.addEventListener("pointerup",function(e){if(!drag)return;var dg=drag;drag=null;sizer.style.cursor="";
 if(dg.moved<6&&dg.f>=0&&d>L*.97){location.href=FILMS[dg.f].h;return}updateBtn()});
sizer.addEventListener("pointercancel",function(){drag=null});
sizer.addEventListener("pointerleave",function(){if(!drag){hot=-1;lab.textContent=""}});
function updateBtn(){tg.textContent=d>L*.97?"Rentrer la pellicule":"Tirer la pellicule"}
tg.addEventListener("click",function(){touched=true;if(d>L*.97){retract()}else{tugs(d/L)}loop();setTimeout(updateBtn,60)});
setInterval(updateBtn,500);
})();
