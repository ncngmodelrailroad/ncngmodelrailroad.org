// Recovered from the shipped bootstrap. Build with npm run build:map.
(() => {
  let finished = false;
  const timeout = window.setTimeout(() => {
    window.__mapBootstrapFail?.("Map initialization timed out. Check your network connection and reload.");
  }, 25000);
  window.__mapBootstrapDone = () => {
    finished = true;
    window.clearTimeout(timeout);
  };
  window.__mapBootstrapFail = message => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timeout);
    const errorCard = document.querySelector("#error");
    if (!errorCard || !errorCard.hidden) return;
    errorCard.hidden = false;
    errorCard.className = "error-card";
    const heading = document.createElement("h2");
    heading.textContent = "Map could not start";
    const detail = document.createElement("p");
    detail.textContent = message;
    errorCard.replaceChildren(heading, detail);
    const status = document.querySelector("#status");
    if (status) status.textContent = "Map initialization failed";
  };
  window.addEventListener("error", event => {
    if (event.error) {
      window.__mapBootstrapFail(`Unexpected initialization error: ${event.error.message || event.message}. Reload to try again.`);
    }
  });
})();
