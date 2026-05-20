import { Modal } from "../modal";
import type { Options } from "../models/widget";
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

  constructor(options: Options) {
    this.options = options;
    console.log("[cross-service-link]: initialized");
  }

  mount() {
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
  }

  destroy() {
    this.detachEvents();
    this.host.remove();
  }

  private render() {
    const styles = document.createElement("style");
    styles.textContent = css;
    this.root.appendChild(styles);
    const template = createTemplate(html);
    this.root.appendChild(template);
    console.log("[cross-service-link]: render");
  }

  private handleViewClick = () => {
    this.modal.open();
  };

  private handleNeverShowClick = () => {
    this.destroy();
    storage.setNeverShow(true);
    console.log("[cross-service-link]: never show enabled");
  };

  private attachEvents() {
    const view = this.root.getElementById("csl-view");
    view?.addEventListener("click", this.handleViewClick);
    const neverShow = this.root.getElementById("csl-never-show");
    neverShow?.addEventListener("click", this.handleNeverShowClick);
  }

  private detachEvents() {
    const view = this.root.getElementById("csl-view");
    view?.removeEventListener("click", this.handleViewClick);
    const neverShow = this.root.getElementById("csl-never-show");
    neverShow?.removeEventListener("click", this.handleNeverShowClick);
  }
}
