export const resolveElement = (target?: string | HTMLElement): HTMLElement => {
  if (!target) return document.body;
  if (typeof target !== "string") return target;
  const element = document.querySelector(target);
  if (!element) throw new Error(`Target not found: ${target}`);
  return element as HTMLElement;
};
