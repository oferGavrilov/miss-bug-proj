(function loadModules() {
  const modules = document.body.querySelectorAll('[type="module/babel"]');
  if (!modules.length) return;
  modules.forEach(scriptModule => loadModule(scriptModule));

  function loadModule(moduleScript) {
    const dataset = {
      presets: moduleScript.dataset.presets,
      plugins: moduleScript.dataset.plugins
    };
    const files = [];
    const filesMap = {};
    readFile(moduleScript.src, files);

    for (let i = 0; i < files.length; i++) {
      if (!filesMap[files[i]]) {
        filesMap[files[i]] = files[i];
      } else {
        files.splice(i, 1);
        i--;
      }
    }

    files.push(moduleScript.src);

    files.forEach(file => appendScript(file, dataset));
  }

  function readFile(fileUrl, files) {
    // Should be a host + root + path
    var fileRequest = new XMLHttpRequest();
    fileRequest.open("GET", fileUrl, false);
    fileRequest.onreadystatechange = function() {
      if (fileRequest.readyState === 4) {
        var fileText = fileRequest.responseText;

        const importRegex = /^import .+ from ['|"](.+)['|"]/gm;

        let match = true;
        while (match) {
          match = importRegex.exec(fileText);
          if (match) {
            const relativeSrc = match[1];
            const abs = relativeToAbs(fileUrl, relativeSrc);
            readFile(abs, files);
            files.push(abs);
          }
        }
      }
    };
    fileRequest.send();
  }

  function appendScript(src, dataset) {
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/babel";

    const appendedScript = document.body.appendChild(script);
    if (dataset.presets)
      appendedScript.setAttribute("data-presets", dataset.presets);
    if (dataset.plugins)
      appendedScript.setAttribute("data-plugins", dataset.plugins);
  }

  function relativeToAbs(abs, relative) {
    function backFolder() {
      let lastIdx = abs.lastIndexOf("/");
      abs = abs.substring(0, lastIdx);
    }
    backFolder();

    let backFolderIdx = relative.indexOf("../");
    while (backFolderIdx > -1) {
      relative = relative.substring(3);
      backFolder();
      backFolderIdx = relative.indexOf("../");
    }
    if (abs.charAt(abs.length - 1) === ".")
      abs = abs.substring(0, abs.length - 1);
    if (relative.indexOf("./") === 0) relative = relative.substring(2);
    return `${abs}/${relative}`;
  }
})();
