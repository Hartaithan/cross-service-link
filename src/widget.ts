import type { Options } from "./models/widget";
import { resolveElement } from "./utils/dom";

export class CrossServiceLink {
  private options: Options;
  private container!: HTMLElement;
  private root!: ShadowRoot;
  private mounted = false;

  constructor(options: Options) {
    this.options = options;
    console.log("[cross-service-link]: initialized");
  }

  mount() {
    if (this.mounted) return;
    const target = resolveElement(this.options.target);
    this.container = document.createElement("div");
    this.container.id = "csl-root";
    target.appendChild(this.container);
    this.root = this.container.attachShadow({ mode: "open" });
    this.render();
    this.mounted = true;
  }

  private render() {
    this.root.innerHTML = `
      <div class="csl-container">
        <pre>Hello World!</pre>
      </div>
    `;
    console.log("[cross-service-link]: render");
  }
}
