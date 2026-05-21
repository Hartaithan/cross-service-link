import type { EmblaCarouselType } from "embla-carousel";

export const setupCarouselDots = (
  embla: EmblaCarouselType,
  dotsNode: HTMLElement | null,
): void => {
  if (!dotsNode) return;

  let nodes: HTMLElement[] = [];

  const attachEvents = (): void => {
    dotsNode.innerHTML = embla
      .scrollSnapList()
      .map(() => '<button class="csl-carousel-dot" type="button"></button>')
      .join("");
    nodes = Array.from(dotsNode.querySelectorAll(".csl-carousel-dot"));
    nodes.forEach((dotNode, index) => {
      dotNode.addEventListener("click", () => embla.scrollTo(index), false);
    });
  };

  const toggleActive = (): void => {
    const previous = embla.previousScrollSnap();
    const selected = embla.selectedScrollSnap();
    nodes[previous].classList.remove("csl-carousel-dot--selected");
    nodes[selected].classList.add("csl-carousel-dot--selected");
  };

  attachEvents();
  toggleActive();

  embla
    .on("reInit", attachEvents)
    .on("reInit", toggleActive)
    .on("select", toggleActive);
};
