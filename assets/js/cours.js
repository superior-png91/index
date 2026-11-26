/* =====================================================================
   COURS DU SAMEDI : lit agenda.txt (via site.js) et cours.txt, affiche le
   prochain cours sur la page et sur l'écran de projection plein écran.
   Le cours se tient chaque samedi ouvert, de 14 h à 15 h (heure de Paris).
   ===================================================================== */
(function(){
  "use strict";
  var F = window.Fous;
  if (!F || !F.parisTime) return;

  var DEBUT = [14, 0], FIN = [15, 0];
  var COURS = lire();
  /* samedis ouverts dont le cours (14 h – 15 h) n'est pas encore terminé : dès 15 h, on passe au samedi suivant */
  var up = F.upcoming(120).filter(function(o){
    if (!o.open) return false;
    var d = o.key.split("/").map(Number);
    return F.parisTime(d[2], d[1], d[0], FIN[0], FIN[1]) > Date.now();
  });
  var item = up[0] || null;
  var data = item ? COURS[item.key] || null : null;

  function $(s, c){ return (c || document).querySelector(s); }
  function el(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function pad(n){ return ("0" + n).slice(-2); }
  function typo(s){ return String(s || "").replace(/ +([!?:;»])/g, " $1").replace(/« +/g, "« "); }
  function maj(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  /* Titres en capitales : on protège les coups d'échecs (1.e4 c5, Cxd4…) pour que Cf3 ne devienne pas CF3 */
  var COUP = /^(\d+(?:\.{1,3}|…))?(?:O-O(?:-O)?|[CFTDR]?[a-h]?x?[a-h][1-8](?:=[CFTD])?)[+#!?]*$/;
  function riche(node, texte){
    node.textContent = "";
    String(typo(texte)).split(/(\s+)/).forEach(function(w){
      if (!w) return;
      var coeur = w.replace(/^[(«]+/, "").replace(/[,;:.)»]+$/, "");
      if (coeur && COUP.test(coeur)) node.appendChild(el("span", "mv", w));
      else node.appendChild(document.createTextNode(w));
    });
    return node;
  }
  function hm(h, m){ return h + " h" + (m ? " " + pad(m) : " " + "00"); }

  /* ---------- lecture de cours.txt ---------- */
  function lire(){
    var out = {}, cur = null;
    String(window.COURS_CLUB || "").split(/\r?\n/).forEach(function(raw){
      var t = raw.trim();
      if (!t || t.charAt(0) === "#") return;
      var m = t.match(/^=+\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
      if (m) { cur = {etapes: []}; out[pad(+m[1]) + "/" + pad(+m[2]) + "/" + m[3]] = cur; return; }
      if (!cur) return;
      m = t.match(/^(\d{1,2})\s*h\s*(\d{2})?\s*;\s*([^;]*?)\s*(?:;\s*(.*))?$/);
      if (m) { cur.etapes.push({h: +m[1], mi: +(m[2] || 0), t: m[3], d: (m[4] || "").trim()}); return; }
      m = t.match(/^(titre|niveau|objectif|[àa] retenir)\s*:\s*(.*)$/i);
      if (m) cur[/retenir/i.test(m[1]) ? "retenir" : m[1].toLowerCase()] = m[2].trim();
    });
    Object.keys(out).forEach(function(k){ out[k].etapes.sort(function(a, b){ return a.h * 60 + a.mi - (b.h * 60 + b.mi); }); });
    return out;
  }

  /* ---------- temps : fenêtre du cours (14 h – 15 h, heure de Paris) ---------- */
  var dj = item ? item.key.split("/").map(Number) : null;                 // [jj, mm, aaaa]
  function at(h, m){ return F.parisTime(dj[2], dj[1], dj[0], h, m); }
  var fen = item ? {a: at(DEBUT[0], DEBUT[1]), b: at(FIN[0], FIN[1])} : null;
  function maintenant(){ return Date.now(); }

  function etat(now){
    if (!item) return {k: "aucun"};
    if (now < fen.a) return {k: "avant"};
    if (now < fen.b) return {k: "pendant"};
    return {k: "apres"};
  }
  function joursAvant(now){
    var p = F.parisParts(now);
    return Math.round((Date.UTC(dj[2], dj[1] - 1, dj[0]) - Date.UTC(p.y, p.m - 1, p.d)) / 864e5);
  }
  function indexCourant(now, st){
    if (!data || st.k !== "pendant") return -1;
    var idx = -1;
    data.etapes.forEach(function(e, i){ if (at(e.h, e.mi) <= now) idx = i; });
    return idx;
  }

  /* ---------- fiche sur la page ---------- */
  function etapesListe(ol, cls){
    ol.textContent = "";
    data.etapes.forEach(function(e){
      var li = el("li");
      li.appendChild(el("span", cls.t, hm(e.h, e.mi)));
      li.appendChild(riche(el("span", cls.n), e.t));
      if (e.d) li.appendChild(el("span", cls.d, typo(e.d)));
      ol.appendChild(li);
    });
  }
  function retenir(p, label){
    p.textContent = "";
    if (data && data.retenir) {
      p.appendChild(el("b", null, label));
      p.appendChild(document.createTextNode(typo(data.retenir)));
      p.hidden = false;
    } else p.hidden = true;
  }

  function remplirPage(){
    var titre = data && data.titre ? data.titre : "Programme à venir";
    riche($("#csTitre"), titre);
    $("#csScreen").style.setProperty("--tt", titre.length <= 24 ? 4.5 : titre.length <= 34 ? 3.8 : titre.length <= 46 ? 3.2 : 2.7);
    $("#csDate").textContent = item ? maj(item.label) : "Les prochaines dates arrivent";
    riche($("#csFTitre"), titre);
    /* Jour sans cours (titre « Pas de cours ») : on masque niveau, horaire, bouton de projection et rappel de la Salle 1 */
    var pas = !!(data && /^pas de cours/i.test(data.titre || ""));
    [".cs-kick span", ".cs-bar", ".cs-note"].forEach(function(s){ var n = $(s); if (n) n.style.display = pas ? "none" : ""; });
    var niv = (data && data.niveau) || "Tous niveaux";
    $("#csFKick").textContent = item ? "Programme du " + item.label + (pas ? "" : " · " + niv) : "Programme de la séance";
    var obj = $("#csFObj");
    if (data && data.objectif) { obj.textContent = typo(data.objectif); obj.hidden = false; }
    else if (!data) { obj.textContent = "Le programme de ce samedi sera publié très bientôt. Le cours a lieu de 14 h à 15 h, ouvert à tous les niveaux."; obj.hidden = false; }
    else obj.hidden = true;
    var ol = $("#csFEtapes");
    if (data && data.etapes.length) { etapesListe(ol, {t: "t", n: "n", d: "d"}); ol.hidden = false; } else ol.hidden = true;
    retenir($("#csFRetenir"), "À retenir");

    var ul = $("#csListe");
    ul.textContent = "";
    if (!up.length) { var li0 = el("li", "cs-it"); li0.appendChild(el("p", "th vide", "Les prochains samedis seront annoncés prochainement.")); ul.appendChild(li0); }
    var pa = F.parisParts(Date.now()), auj = pad(pa.d) + "/" + pad(pa.m) + "/" + pa.y;
    up.slice(0, 4).forEach(function(o, i){
      var d = COURS[o.key], li = el("li", "cs-it");
      li.appendChild(el("p", "jr", (i === 0 ? (o.key === auj ? "Aujourd'hui · " : "À venir · ") : "") + maj(o.label)));
      li.appendChild(el("p", d && d.titre ? "th" : "th vide", d && d.titre ? typo(d.titre) : "Programme à venir"));
      if (o.note) li.appendChild(el("p", "nt", "À l'agenda : " + o.note));
      ul.appendChild(li);
    });
  }

  /* ---------- écran de projection ---------- */
  var pj = $("#pj"), btn = $("#csProj"), fsOK = false, verrou = null, hidden = [];
  /* bruitage du projecteur (3 s, puis silence) : joué seulement à l'ouverture de la projection */
  var son = null;
  function sonPret(){ if (!son) { try { son = new Audio("assets/audio/projecteur.mp3"); son.preload = "auto"; son.volume = .8; } catch (e) { son = null; } } }
  function bruitage(){ sonPret(); if (!son) return; try { son.currentTime = 0; var r = son.play(); if (r && r.catch) r.catch(function(){}); } catch (e) {} }
  function remplirProjection(){
    var titre = data && data.titre ? data.titre : "Programme à venir";
    riche($("#pjTitre"), titre);
    var n = titre.length;
    pj.style.setProperty("--tt", n <= 20 ? 10.6 : n <= 30 ? 9.2 : n <= 42 ? 7.6 : 6.2);
    $("#pjNiv").textContent = (data && data.niveau) || "Tous niveaux";
    var ol = $("#pjEtapes");
    if (data && data.etapes.length) {
      etapesListe(ol, {t: "pj-t", n: "pj-n", d: "pj-d"});
      var k = data.etapes.length;
      pj.style.setProperty("--k", k <= 4 ? 1.25 : k <= 7 ? 1 : k <= 9 ? .86 : .74);
      ol.hidden = false;
    } else ol.hidden = true;
    retenir($("#pjRetenir"), "À retenir");
  }

  /* ---------- mise à jour (toutes les 5 s) ---------- */
  function tick(){
    var now = maintenant(), st = etat(now), idx = indexCourant(now, st);

    [["#csFEtapes", "li"], ["#pjEtapes", "li"]].forEach(function(c){
      var lis = document.querySelectorAll(c[0] + " " + c[1]);
      for (var i = 0; i < lis.length; i++) {
        lis[i].classList.toggle("is-now", i === idx);
        lis[i].classList.toggle("is-past", idx >= 0 && i < idx);
        if (i === idx) lis[i].setAttribute("aria-current", "step"); else lis[i].removeAttribute("aria-current");
      }
    });

    if (!pj.hidden) {
      var p = F.parisParts(now);
      $("#pjHorloge").textContent = pad(p.h) + ":" + pad(p.mi);
      var txt = "";
      if (st.k === "avant" && joursAvant(now) > 0) txt = "À venir · " + maj(item.label);
      else if (st.k === "aucun") txt = "Les prochains cours seront annoncés bientôt";
      $("#pjCompte").textContent = typo(txt);
      var cur = $("#pjEtapes .is-now");
      if (cur && cur !== tick.dernier) { tick.dernier = cur; if (cur.scrollIntoView) cur.scrollIntoView({block: "nearest"}); }
    }
  }

  /* ---------- ouverture / fermeture de la projection ---------- */
  function ouvrir(){
    remplirProjection();
    bruitage();
    pj.hidden = false;
    document.documentElement.classList.add("pj-on");
    hidden = [].slice.call(document.body.children).filter(function(n){ return n !== pj && n.tagName !== "SCRIPT"; });
    hidden.forEach(function(n){ n.inert = true; });
    tick();
    var rq = pj.requestFullscreen || pj.webkitRequestFullscreen;
    if (rq) { try { var r = rq.call(pj); if (r && r.catch) r.catch(function(){}); } catch (e) {} }
    if (navigator.wakeLock && navigator.wakeLock.request) { navigator.wakeLock.request("screen").then(function(l){ verrou = l; }).catch(function(){}); }
    $("#pjX").focus({preventScroll: true});
  }
  function fermer(){
    if (pj.hidden) return;
    pj.hidden = true;
    if (son) { try { son.pause(); } catch (e) {} }
    document.documentElement.classList.remove("pj-on");
    hidden.forEach(function(n){ n.inert = false; });
    if (verrou) { try { verrou.release(); } catch (e) {} verrou = null; }
    var fe = document.fullscreenElement || document.webkitFullscreenElement;
    if (fe) { var ex = document.exitFullscreen || document.webkitExitFullscreen; try { var r = ex.call(document); if (r && r.catch) r.catch(function(){}); } catch (e) {} }
    fsOK = false;
    btn.focus({preventScroll: true});
    setTimeout(function(){ if (pj.hidden) btn.focus({preventScroll: true}); }, 200);
  }
  function surPleinEcran(){
    var fe = document.fullscreenElement || document.webkitFullscreenElement;
    if (fe === pj) fsOK = true;
    else if (fsOK && !pj.hidden) fermer();
  }
  document.addEventListener("fullscreenchange", surPleinEcran);
  document.addEventListener("webkitfullscreenchange", surPleinEcran);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !pj.hidden) { e.preventDefault(); fermer(); } });
  document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "visible") {
      tick();
      if (!pj.hidden && navigator.wakeLock && !verrou) navigator.wakeLock.request("screen").then(function(l){ verrou = l; }).catch(function(){});
    }
  });
  btn.addEventListener("click", ouvrir);
  ["pointerenter", "focus", "touchstart"].forEach(function(ev){ btn.addEventListener(ev, sonPret, {once: true, passive: true}); });   // le son se charge à l'approche du bouton
  $("#pjX").addEventListener("click", fermer);

  remplirPage();
  tick();
  setInterval(tick, 5000);
})();
