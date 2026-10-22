// Applies the saved theme before first paint, then adds a toggle to the top bar.
(function () {
  var KEY = "cs61a-mt2-theme";
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute("data-theme", saved === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    var slot = document.querySelector(".top-actions");
    if (!slot) return;
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    function paint() {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.textContent = dark ? "\u2600 Light" : "\u263E Dark";
      btn.setAttribute("aria-label", "Switch to " + (dark ? "light" : "dark") + " theme");
    }
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint();
    });
    paint();
    slot.appendChild(btn);
  });
})();
