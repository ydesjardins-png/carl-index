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

  /* ---- Live status card: play (and replay) the feed when scrolled into view ---- */
  var statusCard = document.querySelector(".status-card");
  if (statusCard && "IntersectionObserver" in window) {
    var statusIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // restart animation by toggling the class
          statusCard.classList.remove("is-playing");
          void statusCard.offsetWidth; // force reflow so re-adding replays
          statusCard.classList.add("is-playing");
        } else {
          statusCard.classList.remove("is-playing");
        }
      });
    }, { threshold: 0.45 });
    statusIO.observe(statusCard);
  } else if (statusCard) {
    statusCard.classList.add("is-playing");
  }

  /* ---- Scroll reveal removed: content must never depend on JS to be visible.
     A CSS-only entrance handles polish without any risk of hidden content. ---- */

  /* ---- Bold 3D tilt on cards (mouse only; touch + reduced-motion skip it) ---- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!prefersReduced && canHover) {
    var tiltCards = document.querySelectorAll(
      ".hero-card, .step, .cost-table-card, .adm-card, .final-card, .trust-item, .faq-item"
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
