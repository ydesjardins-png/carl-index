/* DuCash — homepage interactions */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Live loan estimator (23% annual, matches disclosed cost table) ---- */
  var APR = 0.23;
  var DAYS_IN_YEAR = 365;

  var montant = document.getElementById("montant");
  var montantVal = document.getElementById("montant-val");
  var duree = document.getElementById("duree");
  var estInteret = document.getElementById("est-interet");
  var estTotal = document.getElementById("est-total");

  function formatCAD(value) {
    // fr-CA currency formats as "37,81 $" — already includes the symbol.
    return value.toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD",
      currencyDisplay: "narrowSymbol"
    });
  }

  function updateEstimate() {
    if (!montant || !duree) return;
    var principal = parseFloat(montant.value);
    var days = parseFloat(duree.value);
    var interest = principal * APR * (days / DAYS_IN_YEAR);
    var total = principal + interest;

    if (montantVal) montantVal.textContent = principal.toLocaleString("fr-CA") + " $";
    if (estInteret) estInteret.textContent = formatCAD(interest);
    if (estTotal) estTotal.textContent = formatCAD(total);
  }

  if (montant) montant.addEventListener("input", updateEstimate);
  if (duree) duree.addEventListener("change", updateEstimate);
  updateEstimate();

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
