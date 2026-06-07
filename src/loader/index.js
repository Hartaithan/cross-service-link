(function () {
  var script = document.createElement("script");

  script.src = "__CSL_SRC__";
  script.async = true;

  script.onload = function () {
    document.dispatchEvent(new Event("cross-service-link:ready"));
  };

  script.onerror = function () {
    console.error("[cross-service-link]: failed to load widget");
  };

  document.head.appendChild(script);
})();
