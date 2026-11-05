(function () {
  var root = document.documentElement;
  var KEY = "mdst-large-print";
  var btn = document.getElementById("large-print-btn");
  var printBtn = document.getElementById("print-btn");

  function isOn() {
    return root.getAttribute("data-large-print") === "on";
  }

  function render() {
    if (!btn) return;
    btn.setAttribute("aria-pressed", isOn() ? "true" : "false");
    btn.classList.toggle("is-on", isOn());
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = !isOn();
      root.setAttribute("data-large-print", next ? "on" : "off");
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch (e) {}
      render();
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  render();
})();
