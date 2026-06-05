import { items } from "../constants/items";
import { Modal } from "../modal";
import { animateExit } from "../utils/animation";
import { delay } from "../utils/async";
import {
  createTemplate,
  EventManager,
  renderTemplate,
  resolveElement,
} from "../utils/dom";
import { storage } from "../utils/storage";
import item from "./item.html?raw";
import css from "./styles.css?inline";
import html from "./template.html?raw";

export class CrossServiceLink {
  static ready: Promise<void> = Promise.resolve();
  private options: CrossServiceLink.Options;
  private host!: HTMLElement;
  private root!: ShadowRoot;
  private modal!: Modal;
  private mounted = false;
  private aborted = false;
  private eventManager = new EventManager();

  constructor(options: CrossServiceLink.Options) {
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

  async unmount() {
    this.aborted = true;
    if (!this.mounted) return;
    await animateExit(this.host, "csl-widget-exit");
    this.eventManager.removeAll();
    this.modal.close();
    this.host.remove();
    this.mounted = false;
    console.log("[cross-service-link]: unmounted");
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
    this.unmount();
  };

  private handleNeverShowClick = () => {
    this.options.events?.onNeverShowClick?.();
    storage.setNeverShow(true);
    this.unmount();
    console.log("[cross-service-link]: never show enabled");
  };

  private attachEvents() {
    const items = this.root.querySelectorAll(".csl-widget-item");
    for (const item of items) {
      this.eventManager.add(item as HTMLElement, "click", this.handleItemClick);
    }
    const view = this.root.getElementById("csl-view");
    this.eventManager.add(view, "click", this.handleViewClick);
    const close = this.root.getElementById("csl-close");
    this.eventManager.add(close, "click", this.handleCloseClick);
    const neverShow = this.root.getElementById("csl-never-show");
    this.eventManager.add(neverShow, "click", this.handleNeverShowClick);
  }
}
