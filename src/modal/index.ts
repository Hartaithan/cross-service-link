import EmblaCarousel from "embla-carousel";
import { items } from "../constants/items";
import { animateExit } from "../utils/animation";
import { setupCarouselDots } from "../utils/carousel";
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

  async close() {
    if (!this.mounted) return;
    this.detachEvents();
    await animateExit(this.container, "csl-modal-exit");
    this.container.remove();
    this.mounted = false;
    console.log("[modal]: closed");
  }

  private renderSlides(container: HTMLElement) {
    const origin = window.location.origin;
    container.innerHTML = items
      .filter((item) => item.link !== origin)
      .map(
        (
          item,
        ) => `<div class="csl-carousel-slide" data-slide-id="${item.id}" style="--image-background: ${item.image_background};">
        <img class="csl-carousel-slide-image" src="${item.image_url}" alt="${item.title}" />
        <div class="csl-carousel-slide-content">
          <h3 class="csl-carousel-slide-title">${item.title}</h3>
          <p class="csl-carousel-slide-description">${item.description}</p>
          <a class="csl-primary-button csl-carousel-slide-link" href="${item.link}">Try it now!</a>
        </div>
      </div>`,
      )
      .join("");
  }

  private initCarousel() {
    const wrapper = this.container.querySelector<HTMLElement>(".csl-carousel");
    if (!wrapper) return;
    const viewport = wrapper.querySelector<HTMLElement>(
      ".csl-carousel-viewport",
    );
    if (!viewport) return;
    const container = viewport.querySelector<HTMLElement>(
      ".csl-carousel-container",
    );
    if (!container) return;

    this.renderSlides(container);

    const embla = EmblaCarousel(viewport);

    const dots =
      this.container.querySelector<HTMLElement>(".csl-carousel-dots");
    setupCarouselDots(embla, dots);
  }

  private render() {
    const styles = document.createElement("style");
    styles.textContent = css;
    this.root.appendChild(styles);
    const template = createTemplate(html);
    this.container = template;
    this.root.appendChild(this.container);
    this.initCarousel();
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
