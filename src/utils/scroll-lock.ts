import css from "./scroll-lock.css?inline";

export class ScrollLock {
  private locked = false;
  private static injected = false;

  constructor() {
    if (ScrollLock.injected) return;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    ScrollLock.injected = true;
  }

  lock() {
    if (this.locked) return;
    const width = window.innerWidth - document.documentElement.clientWidth;
    const body = document.body;
    body.dataset.scrollLocked = "";
    body.style.setProperty("--removed-body-scroll-bar-size", `${width}px`);
    body.style.setProperty("margin-right", `${width}px`, "important");
    this.locked = true;
  }

  unlock() {
    if (!this.locked) return;
    const body = document.body;
    delete body.dataset.scrollLocked;
    body.style.removeProperty("--removed-body-scroll-bar-size");
    body.style.removeProperty("margin-right");
    this.locked = false;
  }
}
