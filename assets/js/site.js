/* =====================================================================
   LES FOUS D'ÉTRÉCHY · script commun à toutes les pages
   ---------------------------------------------------------------------
   Pour modifier le menu sur TOUT le site, changez seulement MENU.
   Chaque groupe devient un menu déroulant ; chaque ligne :
   [case, titre, sous-titre, lien]
   ===================================================================== */
var MENU = [
  ["Le club", [
    ["b2", "Le Fou",        "Pourquoi « les Fous » ?",              "Lesfousdetrechy.html#fou"],
    ["c3", "Le club",       "Une association à taille humaine",     "Lesfousdetrechy.html#club"],
    ["c3", "En images",     "Affiches, forum et vidéo du club",     "Lesfousdetrechy.html#galerie"],
    ["c4", "Histoire",      "De l'idée à l'ouverture",              "Lesfousdetrechy.html#histoire"],
    ["e1", "Le bureau",     "Trois pièces maîtresses",              "Lesfousdetrechy.html#lebureau"]
  ]],
  ["Jouer & apprendre", [
    ["d4", "Activités",     "Une séance, cinq façons d'y jouer",    "Lesfousdetrechy.html#activites"],
    ["e5", "Apprendre",     "Les bases en trois leçons",            "Lesfousdetrechy.html#apprendre"],
    ["f6", "Applications",  "Dix outils pour s'entraîner",          "Lesfousdetrechy.html#applications"],
    ["e4", "Le matériel",   "Échiquiers, pendule, échiquier mural", "Materiel.html"]
  ]],
  ["Infos pratiques", [
    ["g7", "À vous de jouer",       "Saison, lieu, séances et contact", "Lesfousdetrechy.html#rejoindre"],
    ["g8", "Agenda",                "Tous les samedis, 14 h – 18 h",    "Lesfousdetrechy.html#agenda"],
    ["h8", "Les documents du club", "Bulletin, statuts, règlement",     "Lesfousdetrechy.html#documents"],
    ["§",  "Informations légales",  "Mentions et données personnelles", "Lesfousdetrechy.html#mentions"]
  ]],
  ["Les films", [
    ["▶", "Tempête sur l'échiquier", "Une tornade au Corps de garde",     "Tableautempeteavecmusique.html"],
    ["▶", "Le Tableau des Fous",     "La partie sort du cadre",           "Tableaurenaissance.html"],
    ["▶", "Au fil des saisons",      "Une partie, quatre saisons",        "Tableausaisonsavecmusique.html"],
    ["▶", "Tous les films",          "Sur la page d'accueil",             "index.html#films"]
  ]]
];
var CLUB = {
  agenda:    "Lesfousdetrechy.html#agenda",
  rejoindre: "Lesfousdetrechy.html#documents",
  facebook:  "https://www.facebook.com/groups/1205748441366649"
};

(function(){
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function $(s, c){ return (c || document).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function play(v){ var p = v.play(); if (p && p.catch) p.catch(function(){}); }

  /* ------------------------------------------------------------------
     AGENDA : lit agenda.txt (chargé avant ce script).
     Par défaut : tous les samedis, 14 h – 18 h.
     ------------------------------------------------------------------ */
  var MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  var JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
  function parisParts(t){
    var p = {};
    new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Paris",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false})
      .formatToParts(t).forEach(function(x){ p[x.type] = x.value; });
    return {y:+p.year, m:+p.month, d:+p.day, h:+p.hour % 24, mi:+p.minute};
  }
  function parisTime(y, m, d, h, mi){
    var t = Date.UTC(y, m - 1, d, h, mi || 0) - 3600e3;
    if (parisParts(t).h !== h) t -= 3600e3;
    return t;
  }
  function hours(txt){
    var m = String(txt || "").match(/(\d{1,2})\s*h\s*(\d{2})?[^\d]+(\d{1,2})\s*h\s*(\d{2})?/);
    return m ? {a:+m[1], am:+(m[2]||0), b:+m[3], bm:+(m[4]||0), txt:txt.trim()} : {a:14, am:0, b:18, bm:0, txt:"14 h – 18 h"};
  }
  function readAgenda(){
    var map = {};
    if (typeof window.AGENDA_CLUB === "string") {
      window.AGENDA_CLUB.split(/\r?\n/).forEach(function(line){
        line = line.trim();
        if (!line || line.charAt(0) === "#" || line.charAt(0) === "=") return;
        var f = line.split(";").map(function(s){ return s.trim(); });
        var dm = (f[0] || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!dm) return;
        var key = dm[3] + "-" + ("0"+dm[2]).slice(-2) + "-" + ("0"+dm[1]).slice(-2);
        map[key] = {open: !/^ferm/i.test(f[1] || "ouvert"), hours: f[2] ? hours(f[2]) : null, note: (f[3] || "").slice(0, 60)};
      });
    }
    return map;
  }
  function upcoming(days){
    var map = readAgenda(), now = Date.now(), p = parisParts(now), out = [];
    var base = Date.UTC(p.y, p.m - 1, p.d);
    for (var i = 0; i < (days || 120); i++) {
      var dt = new Date(base + i * 864e5);
      var y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate(), wd = dt.getUTCDay();
      var key = y + "-" + ("0"+m).slice(-2) + "-" + ("0"+d).slice(-2);
      var e = map[key];
      if (!e && wd !== 6) continue;
      var open = e ? e.open : true, h = (e && e.hours) || hours("");
      var start = parisTime(y, m, d, h.a, h.am), end = parisTime(y, m, d, h.b, h.bm);
      if (end < now) continue;
      out.push({key:("0"+d).slice(-2) + "/" + ("0"+m).slice(-2) + "/" + y, open:open, hours:h, note:e ? e.note : "", start:start, end:end, label: JOURS[wd] + " " + d + " " + MOIS[m - 1]});
    }
    return out;
  }
  window.Fous = {upcoming: upcoming};

  /* ------------------------------------------------------------------
     EN-TÊTE (menus déroulants) + MENU DES PETITS ÉCRANS + PIED DE PAGE
     ------------------------------------------------------------------ */
  var CHEV = '<svg class="sn-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4"/></svg>';
  var FB = '<span class="sn-fb-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 19.5c.5-3.6 3-5.6 6.2-5.6s5.7 2 6.2 5.6z"/><circle cx="16.6" cy="9" r="2.6"/><path d="M15.4 13.6c.4-.1.8-.1 1.2-.1 2.7 0 4.6 1.7 5 4.9h-4.6c-.3-1.9-.8-3.5-1.6-4.8z"/></svg></span>';
  var here = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  function isHere(href){ return href.split("#")[0] === here; }
  function item(it){
    return '<a class="sn-item" href="' + it[3] + '"' + (isHere(it[3]) && it[3].indexOf("#") < 0 ? ' aria-current="page"' : '') + '>' +
      '<span class="sn-sq">' + it[0] + '</span><span class="sn-t">' + esc(it[1]) + '</span><span class="sn-s">' + esc(it[2]) + '</span></a>';
  }
  var navEl = $("[data-site='nav']");
  if (navEl) {
    navEl.className = "site-nav";
    navEl.setAttribute("aria-label", "Navigation principale");
    navEl.innerHTML = '<div class="sn-wrap">' +
      '<a class="sn-brand" href="index.html"><span class="sn-logo" role="img" aria-label="Logo des Fous d\'Étréchy"></span><span>Les Fous d\'Étréchy</span></a>' +
      '<div class="sn-gnav">' +
        MENU.map(function(g, gi){
          var cur = g[1].some(function(it){ return isHere(it[3]) && it[3].indexOf("#") < 0; });
          return '<div class="sn-dd' + (cur ? ' here' : '') + '"><button class="sn-dd-btn" type="button" aria-expanded="false" aria-controls="snp' + gi + '">' + esc(g[0]) + ' ' + CHEV + '</button>' +
            '<div class="sn-panel" id="snp' + gi + '">' + g[1].map(item).join("") + '</div></div>';
        }).join("") +
        '<a class="sn-cta" href="' + CLUB.rejoindre + '">Nous rejoindre <span aria-hidden="true">→</span></a>' +
        '<a class="sn-fb" href="' + CLUB.facebook + '" target="_blank" rel="noopener" aria-label="Groupe Facebook du club (nouvel onglet)">' + FB + '<span class="sn-fb-t">Facebook</span></a>' +
      '</div>' +
      '<button class="sn-burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="siteMenu"><i></i><i></i></button>' +
    '</div>';

    // menus déroulants : survol sur ordinateur, clic partout
    function closeAll(except){ $$(".sn-dd.open", navEl).forEach(function(x){ if (x !== except) { x.classList.remove("open"); $(".sn-dd-btn", x).setAttribute("aria-expanded", "false"); } }); }
    $$(".sn-dd", navEl).forEach(function(dd){
      var btn = $(".sn-dd-btn", dd), t;
      function set(o){ closeAll(dd); dd.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); }
      btn.addEventListener("click", function(){ set(!dd.classList.contains("open")); });
      if (fine) {
        dd.addEventListener("pointerenter", function(){ clearTimeout(t); set(true); });
        dd.addEventListener("pointerleave", function(){ t = setTimeout(function(){ set(false); }, 180); });
      }
    });
    document.addEventListener("click", function(e){ if (!e.target.closest(".sn-dd")) closeAll(); });

    var menu = document.createElement("div");
    menu.className = "site-menu"; menu.id = "siteMenu"; menu.setAttribute("role", "dialog"); menu.setAttribute("aria-label", "Menu");
    menu.innerHTML = '<div class="sm-top"><a class="sn-brand" href="index.html"><span class="sn-logo" aria-hidden="true"></span><span>Les Fous d\'Étréchy</span></a>' +
      '<button class="sm-close" type="button" aria-label="Fermer le menu">×</button></div><ol class="sm-list">' +
      MENU.map(function(g){
        return '<li class="sm-grp" aria-hidden="true">' + esc(g[0]) + '</li>' + g[1].map(function(it){ return '<li>' + item(it) + '</li>'; }).join("");
      }).join("") + '</ol>' +
      '<div class="sm-acts"><a class="sn-cta" href="' + CLUB.rejoindre + '">Nous rejoindre <span aria-hidden="true">→</span></a>' +
      '<a class="sn-fb" href="' + CLUB.facebook + '" target="_blank" rel="noopener">' + FB + '<span class="sn-fb-t">Facebook</span></a></div>';
    navEl.after(menu);
    var burger = $(".sn-burger", navEl), closeB = $(".sm-close", menu);
    function setMenu(o){ menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); if (o) closeB.focus(); else burger.focus({preventScroll:true}); }
    burger.addEventListener("click", function(){ setMenu(true); });
    closeB.addEventListener("click", function(){ setMenu(false); });
    menu.addEventListener("click", function(e){ if (e.target.closest("a")) menu.classList.remove("open"); });
    addEventListener("keydown", function(e){ if (e.key === "Escape") { if (menu.classList.contains("open")) setMenu(false); closeAll(); } });
  }

  var footEl = $("[data-site='foot']");
  if (footEl) {
    footEl.className = "site-foot";
    footEl.innerHTML = '<div class="sf-wrap">' +
      '<div class="sf-id"><span class="sn-logo" aria-hidden="true"></span><div><b>Les Fous d\'Étréchy</b><br>Club d\'échecs de loisirs · Association · Étréchy (91580), Essonne</div></div>' +
      '<nav class="sf-links" aria-label="Liens utiles"><a href="index.html">Accueil</a><a href="' + CLUB.rejoindre + '">Nous rejoindre</a><a href="' + CLUB.agenda + '">Agenda</a>' +
      '<a href="Lesbasesdesechecs.html">Les bases des échecs</a><a href="Materiel.html">Le matériel</a>' +
      '<a href="Lesfousdetrechy.html#documents">Documents du club</a><a href="Lesfousdetrechy.html#mentions">Mentions légales</a><a href="' + CLUB.facebook + '" target="_blank" rel="noopener">Groupe Facebook ↗</a></nav>' +
      '<span class="sf-diag">a1 → h8 · la grande diagonale</span></div>';
  }

  /* ------------------------------------------------------------------
     ACTUALITÉS DATÉES : data-until / data-from = "AAAA-MM-JJTHH:MM:SS+01:00"
     data-until : l'élément disparaît une fois la date passée ;
     data-from  : il n'apparaît qu'à partir de cette date.
     ------------------------------------------------------------------ */
  $$("[data-until], [data-from]").forEach(function(el){
    var u = Date.parse(el.getAttribute("data-until") || ""), f = Date.parse(el.getAttribute("data-from") || ""), now = Date.now();
    if ((!isNaN(u) && now > u) || (!isNaN(f) && now < f)) el.hidden = true;
  });

  /* ------------------------------------------------------------------
     CURSEUR : une bulle dorée sur les zones [data-cursor] (ordinateur)
     ------------------------------------------------------------------ */
  if (fine && $("[data-cursor]")) {
    var cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<div class="bub"></div>';
    document.body.appendChild(cur);
    var bub = $(".bub", cur), mx = -200, my = -200, cx = -200, cy = -200;
    addEventListener("pointermove", function(e){ mx = e.clientX; my = e.clientY; }, {passive:true});
    document.addEventListener("pointerover", function(e){
      var z = e.target.closest && e.target.closest("[data-cursor]");
      if (z) { bub.innerHTML = z.getAttribute("data-cursor"); cur.classList.add("big"); } else cur.classList.remove("big");
    });
    (function loop(){
      cx += (mx - cx) * (reduce ? 1 : .2); cy += (my - cy) * (reduce ? 1 : .2);
      cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------
     TITRE : lettres qui montent une à une (data-split)
     ------------------------------------------------------------------ */
  var li = 0;
  $$("[data-split]").forEach(function(el){
    var delay = parseFloat(el.getAttribute("data-split")) || 0, txt = el.textContent;
    el.textContent = "";
    Array.from(txt).forEach(function(c){
      var s = document.createElement("span");
      s.className = "ch"; s.textContent = c === " " ? " " : c;
      s.style.animationDelay = (delay + li++ * .045) + "s";
      el.appendChild(s);
    });
  });

  /* ------------------------------------------------------------------
     DÉFILÉ DES PROCHAINES DATES (data-ticker), lu dans agenda.txt
     ------------------------------------------------------------------ */
  $$("[data-ticker]").forEach(function(box){
    var track = $(".ticker-track", box), list = upcoming(70).slice(0, 6);
    var html = list.map(function(s){
      var what = !s.open ? "Club fermé" : (s.note || (s.hours.txt === "14 h – 18 h" ? "Séance du club, 14 h – 18 h" : "Séance du club, " + s.hours.txt));
      return '<span class="tk' + (s.open ? "" : " off") + '"><small>' + esc(s.label) + '</small><span>' + esc(what) + '</span></span><span class="tk-sep">\u265D\uFE0E</span>';
    }).join("");
    box.setAttribute("aria-label", "Prochaines dates : " + list.map(function(s){ return s.label + (s.open ? (s.note ? ", " + s.note : ", séance") : ", fermé"); }).join(" ; "));
    track.innerHTML = "";
    for (var n = 0; n < 4; n++) { var set = document.createElement("div"); set.className = "ticker-set"; set.innerHTML = html; track.appendChild(set); }
    // RÉGLETTE PILOTÉE PAR LA MOLETTE
    // Le bandeau se fige (élément [data-pin] qui l'entoure) : la page s'arrête, la molette
    // fait avancer les dates du 7 novembre (la plus proche) jusqu'à la dernière ; en
    // remontant, elles reculent. Sans [data-pin] : avance pendant la traversée de l'écran.
    var first = track.firstElementChild, anchor = box.parentNode.querySelector(".eyebrow"), cur = 0;
    var pin = box.closest("[data-pin]"), band = pin ? pin.firstElementChild : null;
    function x0(){ var pad = parseFloat(getComputedStyle(first.firstElementChild).paddingLeft) || 0; return anchor ? Math.max(0, anchor.getBoundingClientRect().left - box.getBoundingClientRect().left - pad) : 0; }
    function course(){
      var last = first.lastElementChild.previousElementSibling || first.lastElementChild;
      return Math.max(0, last.offsetLeft + last.offsetWidth - box.clientWidth + x0() + 40);
    }
    function sizePin(){                                    // longueur de molette = longueur de la réglette
      if (!pin) return;
      if (reduce) { pin.style.height = ""; return; }
      pin.style.height = (band.offsetHeight + Math.max(innerHeight * .6, course() * .5)) + "px";
    }
    sizePin(); addEventListener("resize", sizePin);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizePin);
    function progress(){
      if (pin && !reduce) {
        var stick = parseFloat(getComputedStyle(band).top) || 0, run = pin.offsetHeight - band.offsetHeight;
        return run > 0 ? Math.max(0, Math.min(1, (stick - pin.getBoundingClientRect().top) / run)) : 0;
      }
      var r = box.getBoundingClientRect(), vh = innerHeight;
      return Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    }
    (function run(){
      var target = progress() * course();
      cur += (target - cur) * (reduce ? 1 : .16);
      if (Math.abs(target - cur) < .1) cur = target;
      track.style.transform = "translate3d(" + (x0() - cur) + "px,0,0)";
      requestAnimationFrame(run);
    })();
  });

  /* ------------------------------------------------------------------
     TEXTE qui s'allume mot à mot au défilement (data-lit)
     ------------------------------------------------------------------ */
  $$("[data-lit]").forEach(function(el){
    el.classList.add("lit");
    var words = [];
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(ch){
        if (ch.nodeType === 3) {
          var frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function(part){
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span"); s.className = "w"; s.textContent = part;
            frag.appendChild(s); words.push(s);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) walk(ch);
      });
    })(el);
    function fill(){
      var r = el.getBoundingClientRect(), vh = innerHeight;
      var p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height + vh * .3)));
      var k = reduce ? words.length : Math.round(p * words.length);
      words.forEach(function(w, i){ w.classList.toggle("on", i < k); });
    }
    addEventListener("scroll", fill, {passive:true}); addEventListener("resize", fill); fill();
  });


  /* ------------------------------------------------------------------
     EFFETS inspirés de rejouice.com
     data-reveal-lines : le titre monte mot par mot à son apparition
     data-curtain      : l'image ou le film se dévoile comme un rideau
     data-magnetic     : le bouton suit légèrement la souris
     ------------------------------------------------------------------ */
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("fx-js");
    $$("[data-reveal-lines]").forEach(function(el){
      var k = 0;
      (function walk(node){
        Array.prototype.slice.call(node.childNodes).forEach(function(ch){
          if (ch.nodeType === 3) {
            var frag = document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach(function(part){
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              var wl = document.createElement("span"), wi = document.createElement("span");
              wl.className = "wl"; wi.className = "wi"; wi.style.setProperty("--i", k++); wi.textContent = part;
              wl.appendChild(wi); frag.appendChild(wl);
            });
            ch.replaceWith(frag);
          } else if (ch.nodeType === 1) walk(ch);
        });
      })(el);
    });
    // un élément masqué par son rideau est invisible pour le navigateur : on surveille son cadre
    var fxIo = new IntersectionObserver(function(en){
      en.forEach(function(e){ if (e.isIntersecting) { (e.target._fx || e.target).classList.add("in"); fxIo.unobserve(e.target); } });
    }, {threshold:.25, rootMargin:"0px 0px -8% 0px"});
    $$("[data-reveal-lines]").forEach(function(el){ fxIo.observe(el); });
    $$("[data-curtain]").forEach(function(el){ var box = el.parentNode; box._fx = el; fxIo.observe(box); });
  }
  if (fine && !reduce) {
    $$("[data-magnetic]").forEach(function(btn){
      btn.addEventListener("pointermove", function(e){
        var r = btn.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (dx * .22).toFixed(1) + "px," + (dy * .32).toFixed(1) + "px)";
        var a = btn.querySelector(".arr"); if (a) a.style.transform = "translate(" + (dx * .1).toFixed(1) + "px," + (dy * .1).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function(){
        btn.style.transform = ""; var a = btn.querySelector(".arr"); if (a) a.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     CHIFFRES qui défilent à leur apparition (data-count)
     ------------------------------------------------------------------ */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e){
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, to = +el.getAttribute("data-count"), t0 = performance.now();
        (function step(t){
          var p = Math.min(1, (t - t0) / 1400);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, {threshold:.6});
    $$("[data-count]").forEach(function(el){ io.observe(el); });
  }

  /* ------------------------------------------------------------------
     RANGÉES À SURVOL : une photo suit la souris (data-img)
     ------------------------------------------------------------------ */
  var rows = $$("[data-img]");
  if (rows.length && fine) {
    var fol = document.createElement("div");
    fol.className = "follow"; fol.setAttribute("aria-hidden", "true");
    fol.innerHTML = '<img alt="">';
    document.body.appendChild(fol);
    var fimg = $("img", fol), fx = 0, fy = 0, tx = 0, ty = 0;
    rows.forEach(function(r){
      new Image().src = r.getAttribute("data-img");
      r.addEventListener("pointerenter", function(){ fimg.src = r.getAttribute("data-img"); fol.classList.add("on"); });
      r.addEventListener("pointerleave", function(){ fol.classList.remove("on"); });
    });
    addEventListener("pointermove", function(e){ tx = e.clientX; ty = e.clientY; }, {passive:true});
    (function f(){
      fx += (tx - fx) * (reduce ? 1 : .14); fy += (ty - fy) * (reduce ? 1 : .14);
      fol.style.left = fx + "px"; fol.style.top = fy + "px";
      requestAnimationFrame(f);
    })();
  }

  /* ------------------------------------------------------------------
     PENDULE : compte à rebours jusqu'à la prochaine séance + heure
     ------------------------------------------------------------------ */
  $$("[data-pendule]").forEach(function(pd){
    var n1 = $("[data-p='cd']", pd), s1 = $("[data-p='cds']", pd), l1 = $("[data-p='cdl']", pd);
    var n2 = $("[data-p='now']", pd), s2 = $("[data-p='nows']", pd);
    var fmtT = new Intl.DateTimeFormat("fr-FR",{timeZone:"Europe/Paris",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
    var fmtD = new Intl.DateTimeFormat("fr-FR",{timeZone:"Europe/Paris",weekday:"long",day:"numeric",month:"long"});
    var next = null, at = 0, target = pd.getAttribute("data-date"), what = pd.getAttribute("data-label") || "Prochaine séance dans";
    function pad(v){ return ("0" + v).slice(-2); }
    function tick(){
      var now = Date.now();
      if (!next || now > next.end || now - at > 6e4) { next = upcoming(120).filter(function(s){ return s.open && (!target || s.key === target); })[0] || null; at = now; }
      n2.textContent = fmtT.format(now); s2.textContent = fmtD.format(now);
      if (!next) { n1.textContent = "--:--"; s1.textContent = "Voir l'agenda"; return; }
      if (now >= next.start) {
        l1.textContent = "Séance en cours"; n1.textContent = "En jeu";
        s1.textContent = (next.note ? next.note + " · " : "") + "jusqu'à " + next.hours.b + " h"; return;
      }
      l1.textContent = what;
      var s = Math.floor((next.start - now) / 1000), dd = Math.floor(s / 86400); s -= dd * 86400;
      n1.textContent = dd ? dd + "j " + pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s % 3600 / 60))
                          : pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s % 3600 / 60)) + ":" + pad(s % 60);
      s1.textContent = next.label.charAt(0).toUpperCase() + next.label.slice(1) + (target ? " · " + next.hours.txt : (next.note ? " · " + next.note : ""));
    }
    tick(); setInterval(tick, 1000);
    var side = 1;
    pd.addEventListener("click", function(){
      side = 3 - side;
      $$(".face", pd).forEach(function(f, i){ f.classList.toggle("run", i + 1 === side); });
      $$(".knob", pd).forEach(function(k, i){ k.classList.toggle("down", i + 1 === side); });
    });
  });

  /* ------------------------------------------------------------------
     FILM : un film tiré au hasard à chaque visite
     <video data-films='[{"src","poster","page","titre"}]'>
     ------------------------------------------------------------------ */
  $$("video[data-films]").forEach(function(v){
    var films; try { films = JSON.parse(v.getAttribute("data-films")); } catch (e) { return; }
    var order = films.map(function(f, i){ return i; }).sort(function(){ return Math.random() - .5; }), k = 0;
    function load(){
      var f = films[order[k]];
      v.poster = f.poster || ""; v.src = f.src;
      $$("[data-film-href]").forEach(function(a){ a.href = f.page; });
      $$("[data-film-title]").forEach(function(t){ t.textContent = f.titre; });
      if (!reduce) play(v);
    }
    v.addEventListener("error", function(){ if (++k < order.length) load(); }, true);
    load();
    if ("IntersectionObserver" in window && !reduce) new IntersectionObserver(function(en){ if (en[0].isIntersecting) play(v); else v.pause(); }).observe(v);
  });
  $$("[data-hoverplay]").forEach(function(card){
    var v = $("video", card); if (!v) return;
    card.addEventListener("pointerenter", function(){ if (!reduce) play(v); });
    card.addEventListener("pointerleave", function(){ v.pause(); });
  });
})();
