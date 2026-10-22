// Applies the saved theme before first paint, then adds a toggle to the header.
(function () {
  var KEY = "cs61a-mt2-theme";
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute("data-theme", saved === "light" ? "light" : "dark");

  document.addEventListener("DOMContentLoaded", function () {
    var head = document.querySelector("header.top");
    if (!head) return;
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    function paint() {
      var light = root.getAttribute("data-theme") === "light";
      btn.textContent = light ? "[ dark ]" : "[ light ]";
      btn.setAttribute("aria-label", "Switch to " + (light ? "dark" : "light") + " theme");
    }
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint();
    });
    paint();
    head.appendChild(btn);
  });
})();
