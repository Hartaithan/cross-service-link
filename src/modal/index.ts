import type { EmblaCarouselType } from "embla-carousel";
import EmblaCarousel from "embla-carousel";
import { items } from "../constants/items";
import { animateExit } from "../utils/animation";
import { setupCarouselControls } from "../utils/carousel";
import { createTemplate, EventManager, renderTemplate } from "../utils/dom";
import { getImageURL } from "../utils/image";
import slide from "./slide.html?raw";
import css from "./styles.css?inline";
import tab from "./tab.html?raw";
import html from "./template.html?raw";

export class Modal {
  private root: ShadowRoot;
  private container!: HTMLElement;
  private mounted = false;
  private embla: EmblaCarouselType | null = null;
  private filteredItems: typeof items = [];
  private events: CrossServiceLink.Events;
  private eventManager = new EventManager();

  constructor(root: ShadowRoot, events: CrossServiceLink.Events = {}) {
    this.root = root;
    this.events = events;
    console.info("[cross-service-link]: modal initialized");
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
    console.info("[cross-service-link]: modal opened");
  }

  async close() {
    if (!this.mounted) return;
    await animateExit(this.container, "csl-modal-exit");
    this.eventManager.removeAll();
    if (this.embla) {
      this.embla.destroy();
      this.embla = null;
    }
    this.container.remove();
    this.mounted = false;
    console.info("[cross-service-link]: modal closed");
  }

  private getFilteredItems() {
    const origin = window.location.origin;
    return items.filter((item) => item.link !== origin);
  }

  private renderSlides(container: HTMLElement) {
    this.filteredItems = this.getFilteredItems();
    container.innerHTML = this.filteredItems
      .map((item) =>
        renderTemplate(slide, {
          id: item.id,
          image_background: item.image_background,
          image_url: getImageURL(item.image_url),
          title: item.title,
          description: item.description,
          link: item.link,
        }),
      )
      .join("");
  }

  private renderTabs() {
    const tabs = this.container.querySelector<HTMLElement>("#csl-modal-tabs");
    if (!tabs) return;
    tabs.innerHTML = this.filteredItems
      .map((item, i) =>
        renderTemplate(tab, {
          index: i,
          short_title: item.short_title,
          active: i === 0 ? " csl-modal-tab--active" : "",
        }),
      )
      .join("");
  }

  private updateTabs(index: number) {
    const tabs = this.container?.querySelectorAll(".csl-modal-tab");
    if (!tabs) return;
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.classList.toggle("csl-modal-tab--active", i === index);
    }
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
    this.eventManager.add(tabs, "click", (e) => {
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

  private handleOverlayClick = (e: Event) => {
    if (e.target === this.container) {
      this.close();
    }
  };

  private handleCloseClick = () => {
    this.close();
  };

  private handleLinkClick = (event: Event) => {
    if (!event?.target) return;
    const target = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      ".csl-carousel-slide-link",
    );
    if (target && this.events?.onLinkClick) {
      this.events.onLinkClick(target.href);
    }
  };

  private attachEvents() {
    this.eventManager.add(this.container, "click", this.handleOverlayClick);
    this.eventManager.add(this.container, "click", this.handleLinkClick);
    const close = this.container.querySelector<HTMLElement>("#csl-modal-close");
    this.eventManager.add(close, "click", this.handleCloseClick);
  }
}
