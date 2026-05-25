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
    // fr-CA: "1 234,56 $"
    return value.toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD"
    }).replace("CA$", "").trim() + " $";
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
})();
