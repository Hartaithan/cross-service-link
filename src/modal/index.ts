import EmblaCarousel from "embla-carousel";
import { slides } from "../constants/slides";
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

  close() {
    if (!this.mounted) return;
    this.detachEvents();
    this.container.remove();
    this.mounted = false;
    console.log("[modal]: closed");
  }

  private renderSlides(container: HTMLElement) {
    container.innerHTML = slides
      .map(
        (slide) => `<div class="csl-carousel-slide" data-slide-id="${slide.id}">
        <img class="csl-carousel-slide-image" src="${slide.image_url}" alt="${slide.title}" />
        <div class="csl-carousel-slide-content">
          <h3 class="csl-carousel-slide-title">${slide.title}</h3>
          <p class="csl-carousel-slide-description">${slide.description}</p>
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
