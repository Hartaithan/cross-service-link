import type { EmblaCarouselType } from "embla-carousel";

export const setupCarouselControls = (
  embla: EmblaCarouselType,
  prev: HTMLElement | null,
  next: HTMLElement | null,
): void => {
  const scrollPrev = (): void => {
    embla.scrollPrev();
  };
  const scrollNext = (): void => {
    embla.scrollNext();
  };
  prev?.addEventListener("click", scrollPrev, false);
  next?.addEventListener("click", scrollNext, false);
};
