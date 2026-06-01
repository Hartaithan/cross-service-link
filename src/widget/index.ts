import { items } from "../constants/items";
import { Modal } from "../modal";
import type { Options } from "../models/widget";
import { animateExit } from "../utils/animation";
import { delay } from "../utils/async";
import { createTemplate, renderTemplate, resolveElement } from "../utils/dom";
import { storage } from "../utils/storage";
import item from "./item.html?raw";
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
    this.host.dataset.theme = this.options?.theme || "dark";
    target.appendChild(this.host);
    this.root = this.host.attachShadow({ mode: "open" });
    this.modal = new Modal(this.root, this.options.events);
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
      .map((i, index) =>
        renderTemplate(item, {
          index,
          short_title: i.short_title,
          description: i.description,
        }),
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
    this.options.events?.onLearnMoreClick?.();
    this.modal.open();
  };

  private handleCloseClick = () => {
    this.destroy();
  };

  private handleNeverShowClick = () => {
    this.options.events?.onNeverShowClick?.();
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
