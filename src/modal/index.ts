import type { EmblaCarouselType } from "embla-carousel";
import EmblaCarousel from "embla-carousel";
import { items } from "../constants/items";
import { animateExit } from "../utils/animation";
import { setupCarouselControls } from "../utils/carousel";
import { createTemplate } from "../utils/dom";
import css from "./styles.css?inline";
import html from "./template.html?raw";

export class Modal {
  private root: ShadowRoot;
  private container!: HTMLElement;
  private mounted = false;
  private embla: EmblaCarouselType | null = null;
  private filteredItems: typeof items = [];

  constructor(root: ShadowRoot) {
    this.root = root;
    console.log("[modal]: initialized");
  }

  open(initialIndex = 0) {
    if (this.mounted) return;
    this.render();
    this.attachEvents();
    this.mounted = true;
    if (initialIndex > 0) {
      requestAnimationFrame(() => {
        this.embla?.scrollTo(initialIndex);
        this.updateTabs(initialIndex);
      });
    }
    console.log("[modal]: opened");
  }

  async close() {
    if (!this.mounted) return;
    this.detachEvents();
    if (this.embla) {
      this.embla.destroy();
      this.embla = null;
    }
    await animateExit(this.container, "csl-modal-exit");
    this.container.remove();
    this.mounted = false;
    console.log("[modal]: closed");
  }

  private getFilteredItems() {
    const origin = window.location.origin;
    return items.filter((item) => item.link !== origin);
  }

  private renderSlides(container: HTMLElement) {
    this.filteredItems = this.getFilteredItems();
    container.innerHTML = this.filteredItems
      .map(
        (
          item,
        ) => `<div class="csl-carousel-slide" data-slide-id="${item.id}" style="--image-background: ${item.image_background};">
          <img class="csl-carousel-slide-image" src="${item.image_url}" alt="${item.title}" />
          <div class="csl-carousel-slide-content">
            <h3 class="csl-carousel-slide-title">${item.title}</h3>
            <p class="csl-carousel-slide-description">${item.description}</p>
            <a class="csl-carousel-slide-link" href="${item.link}">Visit ${item.title}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></a>
          </div>
        </div>`,
      )
      .join("");
  }

  private renderTabs() {
    const tabs = this.container.querySelector<HTMLElement>("#csl-modal-tabs");
    if (!tabs) return;
    tabs.innerHTML = this.filteredItems
      .map(
        (
          item,
          i,
        ) => `<button class="csl-modal-tab${i === 0 ? " csl-modal-tab--active" : ""}" data-tab-index="${i}">
          <div class="csl-modal-tab-name">${item.short_title}</div>
        </button>`,
      )
      .join("");
  }

  private updateTabs(index: number) {
    const tabs = this.container?.querySelectorAll(".csl-modal-tab");
    if (!tabs) return;
    tabs.forEach((tab, i) => {
      tab.classList.toggle("csl-modal-tab--active", i === index);
    });
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
    this.renderTabs();

    this.embla = EmblaCarousel(viewport, { loop: false });
    this.embla.on("select", () => {
      this.updateTabs(this.embla!.selectedScrollSnap());
    });

    const prev = this.container.querySelector<HTMLElement>("#csl-modal-prev");
    const next = this.container.querySelector<HTMLElement>("#csl-modal-next");
    setupCarouselControls(this.embla, prev, next);

    const tabs = this.container.querySelector<HTMLElement>("#csl-modal-tabs");
    tabs?.addEventListener("click", (e) => {
      const tab = (e.target as HTMLElement).closest<HTMLElement>(
        ".csl-modal-tab",
      );
      if (tab) {
        const index = parseInt(tab.dataset.tabIndex || "0", 10);
        this.embla?.scrollTo(index);
        this.updateTabs(index);
      }
    });
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

  private handleCloseClick = () => {
    this.close();
  };

  private attachEvents() {
    this.container.addEventListener("click", this.handleOverlayClick);
    const close = this.container.querySelector<HTMLElement>("#csl-modal-close");
    close?.addEventListener("click", this.handleCloseClick);
  }

  private detachEvents() {
    this.container.removeEventListener("click", this.handleOverlayClick);
    const close = this.container.querySelector<HTMLElement>("#csl-modal-close");
    close?.removeEventListener("click", this.handleCloseClick);
    const prev = this.container.querySelector<HTMLElement>("#csl-modal-prev");
    prev?.removeEventListener("click", () => this.embla?.scrollPrev());
    const next = this.container.querySelector<HTMLElement>("#csl-modal-next");
    next?.removeEventListener("click", () => this.embla?.scrollNext());
  }
}
