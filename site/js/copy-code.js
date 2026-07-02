(function () {
  "use strict";

  var status, timers = new WeakMap();

  function ensureStatus() {
    if (status) return status;
    status = document.querySelector("[data-code-copy-status]") || document.createElement("div");
    status.setAttribute("data-code-copy-status", "");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    status.setAttribute("style", "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);border:0;white-space:nowrap;");
    if (!status.parentNode) document.body.appendChild(status);
    return status;
  }
  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "readonly");
    area.setAttribute("style", "position:fixed;top:-9999px;");
    document.body.appendChild(area);
    area.select();
    try {
      if (!document.execCommand("copy")) throw new Error("execCommand returned false");
    } finally {
      area.remove();
    }
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function (err) {
      try { fallbackCopy(text); } catch (fallbackErr) { throw fallbackErr || err; }
    });
    try { fallbackCopy(text); return Promise.resolve(); } catch (err) { return Promise.reject(err); }
  }
  function setTemporaryState(button, label, state, message) {
    var timer = timers.get(button);
    if (timer) window.clearTimeout(timer);
    button.textContent = label;
    button.setAttribute("data-state", state);
    ensureStatus().textContent = message;
    timers.set(button, window.setTimeout(function () {
      button.textContent = "Copy"; button.removeAttribute("data-state"); timers.delete(button);
    }, 2000));
  }
  function init() {
    document.querySelectorAll(".code:not([data-copy-ready])").forEach(function (block) {
      if (!block.querySelector("pre code")) return;
      var button = document.createElement("button");
      button.className = "code__copy";
      button.type = "button";
      button.setAttribute("aria-label", "Copy code to clipboard");
      button.textContent = "Copy";
      block.insertBefore(button, block.firstChild); block.setAttribute("data-copy-ready", "");
    });
  }
  function onClick(event) {
    var button = event.target.closest(".code__copy");
    if (!button) return;
    var block = button.closest(".code");
    var code = block && block.querySelector("pre code");
    if (!code) return;
    copyText(code.innerText).then(function () {
      setTemporaryState(button, "Copied", "copied", "Code copied to clipboard");
    }).catch(function (err) {
      console.warn("[fkst] copy failed", err);
      setTemporaryState(button, "Copy failed", "error", "Copy failed");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
  document.addEventListener("click", onClick);
}());
