(function () {
  var resolveReady;
  var rejectReady;

  var ready = new Promise(function (resolve, reject) {
    resolveReady = resolve;
    rejectReady = reject;
  });

  window.CrossServiceLink = { ready };

  var script = document.createElement("script");

  script.src = "__CSL_SRC__";
  script.async = true;

  script.onload = resolveReady;

  script.onerror = function () {
    rejectReady(new Error("Failed to load CrossServiceLink widget"));
  };

  document.head.appendChild(script);
})();
