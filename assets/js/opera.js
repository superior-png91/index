/* La partie de l'Opéra (Morphy contre le duc de Brunswick et le comte Isouard, Paris, 1858) :
   la partie se joue toute seule sur un échiquier en perspective. Notation française. */
(function(){
var root=document.getElementById("ouverture");if(!root||!root.classList.contains("op"))return;
var head=document.getElementById("head3d"),layer=document.getElementById("opIn"),stage=root.querySelector(".op-stage"),board=document.getElementById("opBoard"),wrap=document.getElementById("opWrap"),mvEl=document.getElementById("opMove"),noteEl=document.getElementById("opNote"),
    bPlay=document.getElementById("opPlay"),bNext=document.getElementById("opNext"),bRe=document.getElementById("opRe"),bSp=document.getElementById("opSpeed"),bar=document.getElementById("opBar");
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
/* pièces dessinées (mêmes dessins que l'introduction) : centrées pareil sur tous les appareils, contrairement aux caractères ♚♛ dont la position varie selon la police du téléphone */
var GL={K:"roi",Q:"dame",R:"tour",B:"sym-fou",N:"cavalier",P:"pion"};
/* coup = [départ, arrivée, notation, commentaire, (départ2, arrivée2 : tour du roque)] */
var M=[
["e2","e4","1. e4","Morphy ouvre en prenant le centre."],
["e7","e5","1… e5","Les Noirs répondent symétriquement."],
["g1","f3","2. Cf3","Le cavalier attaque le pion e5."],
["d7","d6","2… d6","La défense Philidor, solide mais passive."],
["d2","d4","3. d4","Les Blancs s'emparent du centre."],
["c8","g4","3… Fg4","Le fou cloue le cavalier f3."],
["d4","e5","4. dxe5","Morphy ouvre le jeu."],
["g4","f3","4… Fxf3","Les Noirs prennent le cavalier."],
["d1","f3","5. Dxf3","La dame reprend."],
["d6","e5","5… dxe5","Les Noirs reprennent le pion."],
["f1","c4","6. Fc4","Le fou vise le point faible f7."],
["g8","f6","6… Cf6","Les Noirs défendent f7 et se développent."],
["f3","b3","7. Db3","Double menace sur f7 et b7."],
["d8","e7","7… De7","Les Noirs protègent f7."],
["b1","c3","8. Cc3","Morphy développe au lieu de prendre b7."],
["c7","c6","8… c6","Les Noirs consolident leur centre."],
["c1","g5","9. Fg5","Le fou cloue le cavalier f6."],
["b7","b5","9… b5","Une erreur : ils attaquent le fou c4."],
["c3","b5","10. Cxb5","Premier sacrifice : Morphy offre son cavalier !"],
["c6","b5","10… cxb5","Les Noirs prennent le cavalier."],
["c4","b5","11. Fxb5+","Échec ! Le fou ouvre la colonne d."],
["b8","d7","11… Cbd7","Les Noirs parent l'échec."],
["e1","c1","12. O-O-O","Le grand roque : la tour entre en jeu.","a1","d1"],
["a8","d8","12… Td8","Les Noirs clouent à leur tour le cavalier d7."],
["d1","d7","13. Txd7","Deuxième sacrifice : la tour prend en d7."],
["d8","d7","13… Txd7","Les Noirs reprennent."],
["h1","d1","14. Td1","La seconde tour entre sur la colonne d."],
["e7","e6","14… De6","Les Noirs proposent l'échange des dames."],
["b5","d7","15. Fxd7+","Le fou prend avec échec."],
["f6","d7","15… Cxd7","Les Noirs reprennent."],
["b3","b8","16. Db8+","Le sacrifice de la dame !"],
["d7","b8","16… Cxb8","Le cavalier prend la dame."],
["d1","d8","17. Td8#","Échec et mat ! Morphy gagne en 17 coups."]];
var START="RNBQKBNR";var pcs=[],map={},ply=0,timer=0,playing=false,speed=1,vis=false,q=60,ctx=0,lastSq=[];
function sq(s){return [s.charCodeAt(0)-97,parseInt(s[1],10)-1]}
function key(c,r){return c+","+r}
function place(p,c,r){p.c=c;p.r=r;p.el.style.transform="translate3d("+(c*q)+"px,"+((7-r)*q)+"px,0)"}
function build(){
 board.querySelectorAll(".pc").forEach(function(e){e.remove()});pcs=[];map={};
 function add(t,col,c,r){var e=document.createElement("div");e.className="pc "+(col=="w"?"w":"b");e.innerHTML='<i class="sh"></i><b class="g" aria-hidden="true"><svg viewBox="0 0 100 140" focusable="false"><use href="#'+GL[t]+'"/></svg></b>';board.appendChild(e);var p={el:e,t:t,col:col,c:c,r:r};place(p,c,r);pcs.push(p);map[key(c,r)]=p}
 for(var c=0;c<8;c++){add(START[c],"w",c,0);add("P","w",c,1);add("P","b",c,6);add(START[c],"b",c,7)}
 ply=0;mark([]);status("","Faites défiler la page pour jouer la partie ↓",true);prog()}
function mark(l){lastSq.forEach(function(e){e.classList.remove("last","chk")});lastSq=[];l.forEach(function(s){var e=board.querySelector('.sq[data-s="'+s+'"]');if(e){e.classList.add("last");lastSq.push(e)}})}
function status(m,n,init){mvEl.textContent=m;noteEl.textContent=n;if(!init){noteEl.classList.remove("in");void noteEl.offsetWidth;noteEl.classList.add("in")}}
function prog(){bar.style.width=(ply/M.length*100)+"%"}
function move(m){
 var a=sq(m[0]),b=sq(m[1]),p=map[key(a[0],a[1])],cap=map[key(b[0],b[1])];
 if(!p)return;
 if(cap){cap.el.classList.add("gone");(function(c){setTimeout(function(){c.el.remove()},900)})(cap);delete map[key(b[0],b[1])]}
 delete map[key(a[0],a[1])];p.el.classList.add("hop");setTimeout(function(){p.el.classList.remove("hop")},850);
 place(p,b[0],b[1]);map[key(b[0],b[1])]=p;
 if(m[4]){var a2=sq(m[4]),b2=sq(m[5]),p2=map[key(a2[0],a2[1])];delete map[key(a2[0],a2[1])];place(p2,b2[0],b2[1]);map[key(b2[0],b2[1])]=p2}
 mark([m[0],m[1]]);
 var chk=/[+#]$/.test(m[2]);if(chk){var kc=pcs.filter(function(x){return x.t=="K"&&x.col==(ply%2==0?"b":"w")})[0];if(kc){var e=board.querySelector('.sq[data-s="'+String.fromCharCode(97+kc.c)+(kc.r+1)+'"]');if(e){e.classList.add("chk");lastSq.push(e)}}}
 ply++;status(m[2],m[3]);prog()}
function step(){if(ply>=M.length)return false;move(M[ply]);return true}
function tick(){clearTimeout(timer);if(!playing||!vis)return;
 if(ply>=M.length){root.classList.add("mat");timer=setTimeout(function(){root.classList.remove("mat");root.classList.add("fade");setTimeout(function(){build();root.classList.remove("fade");if(playing&&vis)timer=setTimeout(tick,900)},800)},5200/speed);return}
 step();var m=M[ply-1];timer=setTimeout(tick,(m[3].length>44?2300:1850)/speed+(ply==M.length?600:0))}
function setPlaying(p){playing=p;bPlay.textContent=p?"Pause":"Lecture";bPlay.setAttribute("aria-label",p?"Mettre la partie en pause":"Lancer la partie");if(p)tick();else clearTimeout(timer)}
bPlay.addEventListener("click",function(){setPlaying(!playing)});
bNext.addEventListener("click",function(){setPlaying(false);if(ply>=M.length){build()}step()});
bRe.addEventListener("click",function(){clearTimeout(timer);root.classList.remove("mat");build();setPlaying(true)});
bSp.addEventListener("click",function(){speed=speed==1?2:1;bSp.textContent="×"+speed;bSp.setAttribute("aria-pressed",speed==2)});
function size(){var W=Math.min(wrap.clientWidth,600,Math.max(300,innerHeight-250));if(innerWidth<=860)W=Math.min(W,Math.max(240,innerHeight-380));q=Math.floor(W/8);var S=q*8;board.style.width=board.style.height=S+"px";board.style.setProperty("--q",q+"px");wrap.style.height=S+"px";pcs.forEach(function(p){place(p,p.c,p.r)})}
/* cases */
for(var r=7;r>=0;r--)for(var c=0;c<8;c++){var e=document.createElement("div");e.className="sq "+((c+r)%2?"l":"d");e.dataset.s=String.fromCharCode(97+c)+(r+1);board.appendChild(e)}
size();addEventListener("resize",size);build();
if("IntersectionObserver" in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&playing)tick();else if(!vis)clearTimeout(timer)},{threshold:.35}).observe(stage)}else vis=true;
document.addEventListener("visibilitychange",function(){if(document.hidden)clearTimeout(timer);else if(playing)tick()});
/* le grand titre grandit puis s'efface en défilant ; la partie démarre quand il a presque disparu */
function cl(x){return x<0?0:x>1?1:x}
var began=false,target=0,pt=0;
function replay(n){build();for(var i=0;i<n;i++)move(M[i])}
function pump(){clearTimeout(pt);if(target>ply){move(M[ply])}else if(target<ply){replay(Math.max(target,ply-1>target?target:target))}if(ply!=target)pt=setTimeout(pump,Math.abs(target-ply)>3?160:420)}
/* seul le titre zoome ; l'échiquier, à peine voilé sous le titre, s'éclaire ; la carte (et « Qui était Paul Morphy ? ») reste visible et cliquable */
var board2=root.querySelector(".op-right");
function onScroll(){var r=root.getBoundingClientRect(),run=r.height-innerHeight,p=run>0?cl(-r.top/run):1,k=cl(p/.16);k=k*k*(3-2*k);
 head.style.opacity=(1-k).toFixed(3);head.style.transform="translateY("+(-60*k)+"px) scale("+(1+.32*k).toFixed(3)+")";
 board2.style.opacity=(.35+.65*k).toFixed(3);
 target=Math.round(cl((p-.2)/.74)*M.length);if(target!=ply)pump()}
if(reduce){root.classList.add("op-static");playing=false;bPlay.textContent="Lecture"}
else{addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);onScroll()}
vis=vis||!("IntersectionObserver" in window);
})();
