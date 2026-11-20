/* Kayá · páginas de serviços e clínicas (base: /blackfriday/main.js)
   Cada página define window.PAGINA com as mensagens do WhatsApp e as palavras da calculadora. */
(function () {
  "use strict";
  var K = window.KAYA || {};
  var P = window.PAGINA || {};
  var doc = document.documentElement;
  var calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  doc.classList.add("js");
  // proteção: se a animação de entrada não rodar (aba em segundo plano), o texto aparece mesmo assim
  setTimeout(function () {
    var h = document.querySelector(".h-acao");
    if (h && getComputedStyle(h).opacity !== "1") doc.classList.add("pronto");
  }, 2600);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var real = function (n) { return Math.round(n).toLocaleString("pt-BR"); };
  var temIO = "IntersectionObserver" in window;

  /* ------------------------- rascunho e o que falta ------------------------- */
  if (K.rascunho) $$("[data-rascunho]").forEach(function (e) { e.hidden = false; });
  var secDJ = $("[data-dojardim]");
  if (secDJ && !K.doJardimAutorizado && !K.rascunho) secDJ.remove();

  /* --------------------------------- vídeos --------------------------------- */
  (function () {
    var sec = $("[data-videos]"), fita = $("[data-fita]");
    if (!sec) return;
    var lista = K.videos || [];
    if (!lista.length) { sec.remove(); return; }
    lista.forEach(function (v, i) {
      var f = document.createElement("figure");
      f.className = "tela";
      f.style.setProperty("--at", Math.min(i, 5) * 0.1 + "s");
      var vid = document.createElement("video");
      vid.src = v.previa || v.arquivo; vid.muted = true; vid.loop = true; vid.playsInline = true; vid.preload = "none";
      vid.setAttribute("playsinline", "");
      if (v.capa) vid.poster = v.capa;
      f.appendChild(vid);
      var som = document.createElement("button");
      som.type = "button"; som.className = "som"; som.textContent = "🔇 tocar com som";
      som.addEventListener("click", function () {
        var ligar = vid.muted;
        $$("video", fita).forEach(function (o) { o.muted = true; });
        $$(".som", fita).forEach(function (b) { b.textContent = "🔇 tocar com som"; });
        if (ligar && v.previa && vid.getAttribute("data-completo") !== "1") {
          vid.setAttribute("data-completo", "1");
          vid.src = v.arquivo; vid.preload = "auto";
        }
        vid.muted = !ligar;
        if (ligar) { vid.currentTime = 0; vid.play().catch(function () {}); som.textContent = "🔊 som ligado"; }
      });
      f.appendChild(som);
      if (v.legenda) { var c = document.createElement("figcaption"); c.textContent = v.legenda; f.appendChild(c); }
      fita.appendChild(f);
    });
    if (!temIO) { fita.classList.add("in"); return; }
    new IntersectionObserver(function (es, o) {
      if (es[0].isIntersecting) { fita.classList.add("in"); o.disconnect(); }
    }, { threshold: 0.15 }).observe(fita);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? e.target.play().catch(function () {}) : e.target.pause(); });
    }, { threshold: 0.5 });
    $$("video", fita).forEach(function (v) { io.observe(v); });
  })();

  /* ---------------------------------- vagas ---------------------------------- */
  var TOT = { plano: 3, sites: 5 };
  var resta = {
    plano: Math.max(0, Math.min(TOT.plano, K.vagasPlano == null ? TOT.plano : K.vagasPlano)),
    sites: Math.max(0, Math.min(TOT.sites, K.vagasSites == null ? TOT.sites : K.vagasSites)),
  };
  function txtVagas(tipo) {
    var n = resta[tipo], t = TOT[tipo];
    if (n === 0) return "Vagas esgotadas";
    if (n === t) return n + " vagas";
    return n === 1 ? "Resta 1 de " + t + " vagas" : "Restam " + n + " de " + t + " vagas";
  }
  $$("[data-vagas]").forEach(function (el) {
    var tipo = el.getAttribute("data-vagas"), b = $(".bolas", el);
    for (var i = 0; i < TOT[tipo]; i++) {
      var d = document.createElement("i");
      if (i >= resta[tipo]) d.className = "foi";
      b.appendChild(d);
    }
    $(".vagas-txt", el).textContent = txtVagas(tipo);
  });
  var resumoCel = $("[data-vagas-resumo-cel]");
  if (resumoCel) resumoCel.textContent = txtVagas("plano") + (resta.plano > 0 ? " no plano" : "");
  var resumo = $("[data-vagas-resumo]");
  if (resumo) {
    resumo.textContent = resta.plano === 0 ? "Vagas do plano esgotadas" : resta.plano === 1 ? "Última vaga no plano" : resta.plano === TOT.plano ? resta.plano + " vagas no plano" : "Restam " + resta.plano + " vagas no plano";
  }

  /* ------------------------------ sinais da dor ------------------------------ */
  (function () {
    var sinais = $$(".sinal"), conta = $("[data-dor-conta]");
    if (!sinais.length) return;
    sinais.forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        var n = $$('.sinal[aria-pressed="true"]').length;
        if (!conta) return;
        conta.hidden = n === 0;
        conta.textContent = n === 1 ? "Você marcou 1 sinal." : "Você marcou " + n + " sinais.";
      });
    });
  })();

  /* ---------------------------------- prazo ---------------------------------- */
  var fim = new Date("2026-11-30T23:59:59-03:00");
  var curto = $("[data-dias-curto]");
  if (curto) {
    var falta = Math.ceil((fim - new Date()) / 864e5);
    curto.textContent = falta <= 0 ? "encerrada" : falta === 1 ? "último dia" : "faltam " + falta + " dias";
  }
  var elDias = $("[data-dias]");
  if (elDias) {
    var ms = fim - new Date();
    var dias = Math.ceil(ms / 864e5);
    elDias.textContent =
      ms <= 0 ? "A Black Kayá terminou em 30/11. Me chama e a gente conversa."
      : dias <= 1 ? "É hoje. Fecha às 23h59."
      : "Faltam " + dias + " dias. Fecha em 30/11, às 23h59.";
  }

  /* --------------------------------- WhatsApp --------------------------------- */
  var MSG = P.msg || {
    geral: "Oi, Pedro! Vi a página da Black Kayá e quero garantir minha vaga.",
    plano: "Oi, Pedro! Vi a página da Black Kayá e quero saber do Plano Crescer.",
    site: "Oi, Pedro! Vi a página da Black Kayá e quero meu site.",
  };
  $$("[data-wa]").forEach(function (a) {
    var m = MSG[a.getAttribute("data-wa")] || MSG.geral;
    a.href = "https://wa.me/" + (K.whatsapp || "") + "?text=" + encodeURIComponent(m);
    a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", function () {
      if (typeof window.fbq === "function") window.fbq("track", "Contact");
    });
  });

  // o botão fixo descansa enquanto o botão da abertura está na tela
  (function () {
    var fixo = $(".wa-fixo"), alvo = $(".h-acao .btn");
    if (!fixo || !alvo || !temIO) return;
    new IntersectionObserver(function (es) { fixo.classList.toggle("some", es[0].isIntersecting); }, { threshold: 0.6 }).observe(alvo);
  })();

  /* ------------------------------ pixel do Meta ------------------------------ */
  if (K.pixel && !local && !K.rascunho) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", K.pixel);
    window.fbq("track", "PageView");
  }

  /* ------------------------------- calculadora ------------------------------- */
  (function () {
    var r = $("#lucro"); if (!r) return;
    var V = [50, 75, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 3000];
    var MENSAL = 875;
    var um = P.um || "cliente novo", varios = P.varios || "clientes novos";
    r.max = V.length - 1;
    function calc() {
      var i = +r.value, lucro = V[i], n = Math.ceil(MENSAL / lucro);
      r.style.setProperty("--p", (i / (V.length - 1)) * 100 + "%");
      $("#lucro-out").textContent = real(lucro);
      $("#calc-n").textContent = n === 1 ? "1 " + um : n + " " + varios;
      var ritmo;
      if (n === 1) ritmo = "Um só no mês inteiro.";
      else if (n > 30) ritmo = "Dá uns " + Math.ceil(n / 30) + " por dia.";
      else if (n > 15) ritmo = "Dá mais ou menos 1 por dia.";
      else ritmo = "Dá 1 a cada " + Math.floor(30 / n) + " dias.";
      $("#calc-ritmo").textContent = ritmo;
    }
    r.addEventListener("input", calc); calc();
  })();

  /* ------------------------- entradas ao rolar a página ------------------------- */
  function conta(el) {
    var alvo = +el.getAttribute("data-conta"), t0 = null, dur = 1600;
    function passo(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = real(alvo * e);
      if (k < 1) requestAnimationFrame(passo);
    }
    el.textContent = "0";
    requestAnimationFrame(passo);
  }
  // o mês sobe primeiro; depois o dia sobe, passa o mês e ganha o selo
  function sobeBarras(box) {
    var bs = $$(".barra", box); if (bs.length < 2) return;
    box.classList.add("anima");
    function sobe(b, dur, depois, aoPassar) {
      var n = $("[data-conta]", b), alvo = +n.getAttribute("data-conta"), col = $(".barra-col i", b), t0 = null;
      function passo(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = alvo * e;
        n.textContent = real(v); col.style.setProperty("--s", e);
        if (aoPassar) aoPassar(v);
        if (k < 1) requestAnimationFrame(passo); else if (depois) depois();
      }
      n.textContent = "0"; requestAnimationFrame(passo);
    }
    var tag = $(".barra-tag", box), mes = +$("[data-conta]", bs[0]).getAttribute("data-conta");
    sobe(bs[0], 1200, function () {
      setTimeout(function () {
        sobe(bs[1], 1700, null, function (v) { if (v >= mes && tag) tag.classList.add("on"); });
      }, 250);
    });
  }
  (function () {
    var els = $$(".rv");
    if (calmo || !temIO) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    // irmãos entram em cascata
    els.forEach(function (e) {
      var irm = Array.prototype.filter.call(e.parentNode.children, function (c) { return c.classList.contains("rv"); });
      e.style.setProperty("--at", Math.min(irm.indexOf(e), 5) * 0.1 + "s");
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add("in");
        if (x.target.classList.contains("barras")) sobeBarras(x.target);
        else $$("[data-conta]", x.target).forEach(conta);
        io.unobserve(x.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ------------------- tudo o que precisa do GSAP ------------------- */
  var feito = false;
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", animar); else animar();
  function animar() {
    if (feito || calmo || !window.gsap || !window.ScrollTrigger) return;
    feito = true;
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    doc.classList.add("anim");
    abertura(gsap);
    estrutura(gsap, ST);
    preco(gsap);
    window.addEventListener("load", function () { ST.refresh(); });
  }

  /* ---- 1 · abertura: o site se monta e o WhatsApp começa a tocar (em loop) ---- */
  function abertura(gsap) {
    var palco = $(".palco"); if (!palco) return;
    var pecas = [".ns-topo", ".ns-txt i", ".ns-img", ".ns-btn", ".ns-cards i"].map(function (s) { return $$(s, palco); });
    var bals = $$(".bal", palco), cel = $(".cel", palco), notif = $(".notif", palco), cursor = $(".cursor", palco), btn = $(".ns-btn", palco);
    function alvoBtn() {
      var p = palco.getBoundingClientRect(), b = btn.getBoundingClientRect();
      return { x: b.left - p.left + b.width * 0.6, y: b.top - p.top + b.height * 0.55 };
    }
    var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, delay: 0.9, defaults: { ease: "power3.out" } });
    tl.set(pecas.flat(), { autoAlpha: 0, y: 12 })
      .set(bals, { autoAlpha: 0, y: 14, scale: 0.9, transformOrigin: "left bottom" })
      .set(cel, { autoAlpha: 0, y: 50 })
      .set(notif, { autoAlpha: 0, y: -14 })
      .set(cursor, { autoAlpha: 0, left: "62%", top: "96%" })
      .to(pecas[0], { autoAlpha: 1, y: 0, duration: 0.5 })
      .to(pecas[1], { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, "-=0.25")
      .to(pecas[2], { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.35")
      .to(pecas[3], { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.4")
      .to(pecas[4], { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 }, "-=0.3")
      .to(cursor, { autoAlpha: 1, duration: 0.2 }, "+=0.1")
      .to(cursor, { left: function () { return alvoBtn().x; }, top: function () { return alvoBtn().y; }, duration: 0.9, ease: "power2.inOut" })
      .to(btn, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 })
      .to(cursor, { autoAlpha: 0, duration: 0.3 }, "+=0.15")
      .to(cel, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.35")
      .to(notif, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.3")
      .to(bals[0], { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, "-=0.2")
      .to(bals[1], { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, "+=0.6")
      .to(bals[2], { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, "+=0.6")
      .to({}, { duration: 2.2 })
      .to([pecas.flat(), bals, cel, notif], { autoAlpha: 0, duration: 0.5, ease: "power1.in" });
    // não gasta bateria quando a abertura sai da tela
    if (temIO) new IntersectionObserver(function (es) { es[0].isIntersecting ? tl.resume() : tl.pause(); }).observe(palco);
  }

  /* ---- 2 · a estrutura: a tela para e as peças entram uma a uma ---- */
  function estrutura(gsap, ST) {
    var sec = $(".estr"); if (!sec) return;
    var eps = $$(".ep", sec), pontos = $$(".ep-pontos i", sec), N = eps.length;
    // texto à esquerda (junto do título) e cena à direita: sem faixa vazia no meio
    var pares = eps.map(function (ep) { return [$(".ep-txt", ep), $(".ep-cena", ep)]; });
    var dentro = $(".estr-in", sec), cab = $(".estr-cab", sec), passos = $(".estr-passos", sec);
    var esq = document.createElement("div"), txts = document.createElement("div"), cenas = document.createElement("div");
    esq.className = "estr-esq"; txts.className = "ep-txts"; cenas.className = "ep-cenas";
    pares.forEach(function (p) { txts.appendChild(p[0]); cenas.appendChild(p[1]); });
    esq.appendChild(cab); esq.appendChild(txts);
    dentro.insertBefore(esq, passos); dentro.insertBefore(cenas, passos);
    passos.parentNode.removeChild(passos);
    var video = $(".cena-video video", sec);
    var atual = -1;
    function marca(i) {
      if (i === atual) return;
      atual = i;
      pontos.forEach(function (p, k) { p.classList.toggle("on", k === i); });
      if (video) {
        if (i === 1) { if (!video.src) video.src = video.getAttribute("data-src"); video.play().catch(function () {}); }
        else video.pause();
      }
    }
    gsap.set(pares.slice(1), { autoAlpha: 0 });

    var tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: sec, start: "top top", end: function () { return "+=" + Math.round(innerHeight * 1.1 * N); },
        pin: true, scrub: 0.6, anticipatePin: 1,
        onToggle: function (st) { doc.classList.toggle("fixando", st.isActive); },
        onUpdate: function (st) { marca(Math.min(N - 1, Math.floor(st.progress * N * 0.999))); },
        onLeaveBack: function () { marca(0); },
      },
    });
    var entra = {
      0: function (t, at) {
        t.from($$(".cena-mapa .cartao", sec), { y: 40, autoAlpha: 0, duration: 0.5 }, at)
          .from($$(".cena-mapa li", sec), { x: -24, autoAlpha: 0, stagger: 0.15, duration: 0.4 }, at + 0.2)
          .from($$(".cena-mapa li i", sec), { scale: 0, stagger: 0.15, duration: 0.3, ease: "back.out(3)" }, at + 0.35)
          .from($$(".c-seta", sec), { scale: 0.6, autoAlpha: 0, duration: 0.4, ease: "back.out(2)" }, at + 0.8);
      },
      1: function (t, at) {
        t.from($$(".visor", sec), { scale: 0.82, rotate: -4, duration: 0.6 }, at)
          .from($$(".canto", sec), { scale: 1.8, autoAlpha: 0, stagger: 0.05, duration: 0.4 }, at + 0.2)
          .from($$(".banco span", sec), { x: 30, autoAlpha: 0, stagger: 0.18, duration: 0.4, ease: "back.out(2)" }, at + 0.5);
      },
      2: function (t, at) {
        // o feed corre e para com o anúncio no meio da cena
        var feed = $(".feed", sec), ad = $(".fp-ad", sec);
        var cena = $(".cena-feed", sec);
        var fim = function () {
          var antes = feed.style.transform; feed.style.transform = "none";
          var c = cena.getBoundingClientRect(), a = ad.getBoundingClientRect();
          feed.style.transform = antes;
          return (c.top + c.height / 2) - (a.top + a.height / 2);
        };
        t.fromTo(feed, { y: function () { return fim() + 300; } }, { y: fim, duration: 1.1, ease: "power2.out" }, at)
          .from($$(".fp-ad", sec), { scale: 0.9, duration: 0.5, ease: "back.out(1.6)" }, at + 0.55)
          .from($$(".fp-acoes .cor", sec), { scale: 0, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(3)" }, at + 0.95)
          .from($$(".fp-tag", sec), { y: 16, scale: 0.8, autoAlpha: 0, duration: 0.4, ease: "back.out(2.4)" }, at + 1.1);
      },
      3: function (t, at) {
        t.from($$(".ms", sec), { y: 40, rotate: 2, duration: 0.5 }, at)
          .from($$(".ms-hero-txt > *", sec), { y: 14, autoAlpha: 0, stagger: 0.1, duration: 0.35 }, at + 0.2)
          .from($$(".mp", sec), { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.35 }, at + 0.35)
          .fromTo($$(".ms-cursor", sec), { left: "88%", top: "96%", autoAlpha: 0 }, { left: "30%", top: "50%", autoAlpha: 1, duration: 0.45, ease: "power2.inOut" }, at + 0.5)
          .to($$(".ms-btn", sec), { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 }, at + 0.95)
          .from($$(".ms-bals .aviso", sec), { y: 20, scale: 0.8, autoAlpha: 0, stagger: 0.25, duration: 0.35, ease: "back.out(2)" }, at + 1.1);
      },
      4: function (t, at) {
        // a conversa chega no WhatsApp, vira cartão e anda no CRM até a venda
        var crm = $(".crm", sec), novo = $(".crm-novo", sec), vagas = $$(".cc-vaga", sec);
        var zap = $(".zap", sec), zbs = $$(".zb", sec), base = $$(".crm-tit, .crm-cols", sec);
        gsap.set(zap, { xPercent: -50, yPercent: -50 });
        var desloca = function (k) { return function () { return vagas[k].offsetLeft - vagas[0].offsetLeft; }; };
        var alvoX = function () { return vagas[0].offsetLeft + vagas[0].offsetWidth / 2 - zap.offsetLeft; };
        var alvoY = function () { return vagas[0].offsetTop + vagas[0].offsetHeight / 2 - zap.offsetTop; };
        t.from(crm, { y: 40, duration: 0.5 }, at)
          .fromTo(base, { autoAlpha: 0.25 }, { autoAlpha: 0.25, duration: 0.01 }, at)
          .from(zap, { y: 40, scale: 0.9, autoAlpha: 0, duration: 0.4, ease: "back.out(1.6)" }, at + 0.05)
          .from(zbs[0], { y: 14, scale: 0.85, autoAlpha: 0, duration: 0.3, ease: "back.out(2)" }, at + 0.3)
          .from(zbs[1], { y: 14, scale: 0.85, autoAlpha: 0, duration: 0.3, ease: "back.out(2)" }, at + 0.55)
          .to(zap, { x: alvoX, y: alvoY, scale: 0.2, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, at + 0.95)
          .to(base, { autoAlpha: 1, duration: 0.35 }, at + 0.95)
          .fromTo(novo, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" }, at + 1.3)
          .to(novo, { x: desloca(1), duration: 0.4, ease: "power2.inOut" }, at + 1.6)
          .to(novo, { x: desloca(2), duration: 0.4, ease: "power2.inOut" }, at + 2.0)
          .to($(".n1", novo), { autoAlpha: 0, duration: 0.1 }, at + 2.35)
          .fromTo($$(".n2, .ic", novo), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, at + 2.38)
          .to(novo, { borderColor: "#FF7557", backgroundColor: "#FFF3EF", duration: 0.25 }, at + 2.38);
      },
      5: function (t, at) {
        t.from($$(".rel2", sec), { y: 40, duration: 0.5 }, at)
          .from($$(".rel-itens li", sec), { x: -24, autoAlpha: 0, stagger: 0.2, duration: 0.4 }, at + 0.25)
          .from($$(".reuniao", sec), { y: 24, scale: 0.85, autoAlpha: 0, duration: 0.4, ease: "back.out(2)" }, at + 0.95);
      },
    };
    // a primeira peça entra sozinha quando a seção chega na tela
    var t0 = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    entra[0](t0, 0);
    t0.timeScale(1.4);
    ST.create({ trigger: sec, start: "top 65%", once: true, onEnter: function () { t0.play(); } });
    tl.to({}, { duration: 0.8 });
    var t = 0.8;
    for (var i = 1; i < N; i++) {
      tl.to(pares[i - 1], { autoAlpha: 0, y: -30, duration: 0.45, ease: "power2.in" }, t)
        .fromTo(pares[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, t + 0.35);
      if (entra[i]) entra[i](tl, t + 0.4);
      t += i === 4 ? 3.3 : 2.6; // o CRM tem mais etapas
    }
    tl.to({}, { duration: 0.6 });
    marca(0);
  }

  /* ---- 3 · o preço que desce ---- */
  function preco(gsap) {
    var num = $("#anc-valor"); if (!num) return;
    var v = { n: 14400 };
    var pinta = function () { num.textContent = real(v.n); };
    var AM = "#FF7557";

    gsap.set(".k-b,.k-c,.s-b,.s-c", { autoAlpha: 0, y: 14 });
    gsap.set(".degraus", { autoAlpha: 0 });
    gsap.set(".degrau", { autoAlpha: 0, scaleX: 0.2 });
    gsap.set(".anc-fim", { autoAlpha: 0, y: 10 });
    gsap.set(".riscavel", { "--risco": "0%" });
    gsap.set(".anc-num", { color: "#ffffff" });
    gsap.set(".anc-mes", { autoAlpha: 0, x: -10 });
    gsap.set(".anc-luz", { scale: 0.85, opacity: 0.6 });
    gsap.set(".dt-b", { autoAlpha: 0, y: 12 });
    var passos = $$(".anc-passos li");
    var marcaPasso = function (k) { passos.forEach(function (p, i) { p.classList.toggle("on", i === k); p.classList.toggle("foi", i < k); }); };
    pinta();

    var tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: ".anc", start: "top top", end: "+=2300", pin: true, scrub: 0.6, anticipatePin: 1,
        onToggle: function (st) { doc.classList.toggle("fixando", st.isActive); },
        onUpdate: function (st) { marcaPasso(st.progress < 0.2 ? 0 : st.progress < 0.55 ? 1 : 2); },
      },
    });
    tl.to({}, { duration: 0.35 });
    tl.addLabel("plano")
      .to(".dt-a", { autoAlpha: 0, y: -12, duration: 0.3 }, "plano+=0.2")
      .to(".dt-b", { autoAlpha: 1, y: 0, duration: 0.4 }, "plano+=1.2")
      .to(".nota", { autoAlpha: 0, y: -24, duration: 0.45 }, "plano")
      .to(".k-a,.s-a", { autoAlpha: 0, y: -14, duration: 0.35 }, "plano")
      .to(".degraus", { autoAlpha: 1, duration: 0.2 }, "plano+=0.3")
      .to(".d1", { autoAlpha: 1, scaleX: 1, duration: 0.5 }, "plano+=0.3")
      .to(".k-b,.s-b", { autoAlpha: 1, y: 0, duration: 0.45 }, "plano+=0.45")
      .to(v, { n: 1750, duration: 1.1, ease: "power2.inOut", onUpdate: pinta }, "plano+=0.5")
      .to(".anc-mes", { autoAlpha: 1, x: 0, duration: 0.4 }, "plano+=1.2")
      .to(".d1 .riscavel", { "--risco": "100%", duration: 0.5 }, "plano+=0.8")
      .to(".d2", { autoAlpha: 1, scaleX: 1, duration: 0.6 }, "plano+=1.1")
      .to({}, { duration: 0.5 });
    tl.addLabel("black")
      .to(".desce", { autoAlpha: 0, x: 20, duration: 0.35 }, "black")
      .to(".k-b,.s-b", { autoAlpha: 0, y: -14, duration: 0.35 }, "black")
      .to(".k-c,.s-c", { autoAlpha: 1, y: 0, duration: 0.45 }, "black+=0.25")
      .to(v, { n: 875, duration: 1.1, ease: "power2.inOut", onUpdate: pinta }, "black+=0.35")
      .to(".anc-num", { color: AM, duration: 0.8 }, "black+=0.5")
      .to(".anc-luz", { scale: 1.25, opacity: 1, duration: 1 }, "black+=0.4")
      .to(".d2 .riscavel", { "--risco": "100%", duration: 0.5 }, "black+=0.6")
      .to(".d3", { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: "back.out(1.6)" }, "black+=0.95")
      .to(".anc-fim", { autoAlpha: 1, y: 0, duration: 0.5 }, "black+=1.4")
      .to({}, { duration: 0.8 });
  }

  // sem GSAP (ou com movimento reduzido), o vídeo da estrutura toca quando aparece
  window.addEventListener("load", function () {
    if (doc.classList.contains("anim")) return;
    var v = $(".cena-video video");
    if (!v || !temIO) return;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { if (!v.src) v.src = v.getAttribute("data-src"); v.play().catch(function () {}); } else v.pause();
    }, { threshold: 0.4 }).observe(v);
  });
})();
