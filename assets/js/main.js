/* DuCash — homepage interactions */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Slider amount display (no live total: cost is fee-inclusive and
     confirmed before signing, so we never compute a misleading exact figure) ---- */
  var montant = document.getElementById("montant");
  var montantVal = document.getElementById("montant-val");

  function updateAmount() {
    if (!montant || !montantVal) return;
    montantVal.textContent = parseFloat(montant.value).toLocaleString("fr-CA") + " $";
  }

  if (montant) montant.addEventListener("input", updateAmount);
  updateAmount();

  /* ---- Sequential reveal: reveal child items on a timer when scrolled into
     view. Reused by the status feed and the eligibility criteria. ---- */
  function sequentialReveal(container, itemSelector, stepMs, extraEl) {
    if (!container) return;
    var items = Array.prototype.slice.call(container.querySelectorAll(itemSelector));
    if (!items.length) return;
    var timers = [];

    function reset() {
      timers.forEach(clearTimeout);
      timers = [];
      items.forEach(function (el) { el.classList.remove("revealed"); });
      if (extraEl) extraEl.classList.remove("revealed");
    }
    function play() {
      reset();
      items.forEach(function (el, i) {
        timers.push(setTimeout(function () { el.classList.add("revealed"); }, i * stepMs));
      });
      if (extraEl) {
        timers.push(setTimeout(function () { extraEl.classList.add("revealed"); }, items.length * stepMs));
      }
    }

    if (!("IntersectionObserver" in window)) {
      // No observer support: show everything (content must never be stuck hidden)
      items.forEach(function (el) { el.classList.add("revealed"); });
      if (extraEl) extraEl.classList.add("revealed");
      return;
    }
    var playing = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !playing) {
          playing = true;
          play();
        } else if (!entry.isIntersecting) {
          playing = false;
          reset();
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -20% 0px" });
    io.observe(container);
  }

  var statusCard = document.querySelector(".status-card");
  sequentialReveal(statusCard, ".status-item", 900, statusCard ? statusCard.querySelector(".status-foot") : null);

  var admCard = document.querySelector(".adm-criteria-card");
  sequentialReveal(admCard, ".adm-item", 500, null);

  /* ---- Scroll reveal removed: content must never depend on JS to be visible.
     A CSS-only entrance handles polish without any risk of hidden content. ---- */

  /* ---- Bold 3D tilt on cards (mouse only; touch + reduced-motion skip it) ---- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!prefersReduced && canHover) {
    var tiltCards = document.querySelectorAll(
      ".hero-card, .step, .cost-table-card, .status-card, .adm-criteria-card, .adm-card, .faq-cta-card, .faq-item"
    );
    var MAX_TILT = 10; // degrees — bold

    tiltCards.forEach(function (card) {
      card.classList.add("tilt-3d");

      function onMove(e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;   // 0..1
        var ry = (px - 0.5) * 2 * MAX_TILT;        // rotateY
        var rx = -(py - 0.5) * 2 * MAX_TILT;       // rotateX
        card.style.transform =
          "perspective(820px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateZ(22px) scale(1.02)";
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
      }
      function onLeave() {
        card.style.transform = "";
      }

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }
})();
