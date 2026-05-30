import { items } from "../constants/items";
import { Modal } from "../modal";
import type { Options } from "../models/widget";
import { animateExit } from "../utils/animation";
import { delay } from "../utils/async";
import { createTemplate, resolveElement } from "../utils/dom";
import { storage } from "../utils/storage";
import css from "./styles.css?inline";
import html from "./template.html?raw";

export class CrossServiceLink {
  private options: Options;
  private host!: HTMLElement;
  private root!: ShadowRoot;
  private modal!: Modal;
  private mounted = false;
  private aborted = false;

  constructor(options: Options) {
    this.options = options;
    console.log("[cross-service-link]: initialized");
  }

  async mount(onMounted?: () => void) {
    if (this.mounted) return;
    if (storage.getNeverShow()) return;
    this.aborted = false;
    await delay(1500);
    if (this.aborted) return;
    if (this.mounted) return;
    if (storage.getNeverShow()) return;
    const target = resolveElement(this.options.target);
    this.host = document.createElement("div");
    this.host.id = "csl-host";
    target.appendChild(this.host);
    this.root = this.host.attachShadow({ mode: "open" });
    this.modal = new Modal(this.root);
    this.render();
    this.attachEvents();
    this.mounted = true;
    onMounted?.();
    console.log("[cross-service-link]: mounted");
  }

  async destroy() {
    this.aborted = true;
    if (!this.mounted) return;
    this.detachEvents();
    await animateExit(this.host, "csl-widget-exit");
    this.host.remove();
    this.mounted = false;
    console.log("[cross-service-link]: destroyed");
  }

  private getFilteredItems() {
    const origin = window.location.origin;
    return items.filter((item) => item.link !== origin);
  }

  private renderItems() {
    const container = this.root.getElementById("csl-items");
    if (!container) return;
    const filtered = this.getFilteredItems();
    container.innerHTML = filtered
      .map(
        (item, i) => `
        <button class="csl-widget-item" data-index="${i}">
          <div class="csl-widget-item-text">
            <div class="csl-widget-item-title">${item.short_title}</div>
            <div class="csl-widget-item-desc">${item.description}</div>
          </div>
          <svg class="csl-widget-item-arrow" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      `,
      )
      .join("");
  }

  private render() {
    const styles = document.createElement("style");
    styles.textContent = css;
    this.root.appendChild(styles);
    const template = createTemplate(html);
    this.root.appendChild(template);
    this.renderItems();
    console.log("[cross-service-link]: render");
  }

  private handleItemClick = (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const index = parseInt(target.dataset.index || "0", 10);
    this.modal.open(index);
  };

  private handleViewClick = () => {
    this.modal.open(0);
  };

  private handleCloseClick = () => {
    this.destroy();
  };

  private handleNeverShowClick = () => {
    storage.setNeverShow(true);
    this.destroy();
    console.log("[cross-service-link]: never show enabled");
  };

  private attachEvents() {
    const items = this.root.querySelectorAll(".csl-widget-item");
    items.forEach((item) => {
      item.addEventListener("click", this.handleItemClick);
    });
    const view = this.root.getElementById("csl-view");
    view?.addEventListener("click", this.handleViewClick);
    const close = this.root.getElementById("csl-close");
    close?.addEventListener("click", this.handleCloseClick);
    const neverShow = this.root.getElementById("csl-never-show");
    neverShow?.addEventListener("click", this.handleNeverShowClick);
  }

  private detachEvents() {
    const items = this.root.querySelectorAll(".csl-widget-item");
    items.forEach((item) => {
      item.removeEventListener("click", this.handleItemClick);
    });
    const view = this.root.getElementById("csl-view");
    view?.removeEventListener("click", this.handleViewClick);
    const close = this.root.getElementById("csl-close");
    close?.removeEventListener("click", this.handleCloseClick);
    const neverShow = this.root.getElementById("csl-never-show");
    neverShow?.removeEventListener("click", this.handleNeverShowClick);
  }
}
