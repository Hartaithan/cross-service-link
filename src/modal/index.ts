import { createTemplate } from "../utils/dom";
import css from "./styles.css?inline";
import html from "./template.html?raw";

export class Modal {
  private root: ShadowRoot;
  private container!: HTMLElement;
  private mounted = false;

  constructor(root: ShadowRoot) {
    this.root = root;
    console.log("[modal]: initialized");
  }

  open() {
    if (this.mounted) return;
    this.render();
    this.attachEvents();
    this.mounted = true;
    console.log("[modal]: opened");
  }

  close() {
    if (!this.mounted) return;
    this.detachEvents();
    this.container.remove();
    this.mounted = false;
    console.log("[modal]: closed");
  }

  private render() {
    const styles = document.createElement("style");
    styles.textContent = css;
    this.root.appendChild(styles);
    const template = createTemplate(html);
    this.container = template;
    this.root.appendChild(this.container);
  }

  private handleOverlayClick = (e: MouseEvent) => {
    if (e.target === this.container) {
      this.close();
    }
  };

  private attachEvents() {
    this.container.addEventListener("click", this.handleOverlayClick);
  }

  private detachEvents() {
    this.container.removeEventListener("click", this.handleOverlayClick);
  }
}
