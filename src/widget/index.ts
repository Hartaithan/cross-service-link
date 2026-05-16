import type { Options } from "../models/widget";
import { resolveElement } from "../utils/dom";
import css from "./styles.css?inline";
import html from "./template.html?raw";

export class CrossServiceLink {
  private options: Options;
  private host!: HTMLElement;
  private root!: ShadowRoot;
  private mounted = false;

  constructor(options: Options) {
    this.options = options;
    console.log("[cross-service-link]: initialized");
  }

  mount() {
    if (this.mounted) return;
    const target = resolveElement(this.options.target);
    this.host = document.createElement("div");
    this.host.id = "csl-host";
    target.appendChild(this.host);
    this.root = this.host.attachShadow({ mode: "open" });
    this.render();
    this.mounted = true;
  }

  destroy() {
    this.host.remove();
  }

  private render() {
    const styles = document.createElement("style");
    styles.textContent = css;
    this.root.appendChild(styles);
    const template = document.createElement("template");
    template.innerHTML = html;
    this.root.appendChild(template.content.cloneNode(true));
    console.log("[cross-service-link]: render");
  }
}
