export const animateExit = async (
  element: HTMLElement,
  exitClass: string,
): Promise<void> => {
  element.classList.add(exitClass);
  await new Promise<void>((resolve) => {
    element.addEventListener("animationend", () => resolve(), { once: true });
  });
};
