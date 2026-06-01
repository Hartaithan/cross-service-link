export const resolveElement = (target?: string | HTMLElement): HTMLElement => {
  if (!target) return document.body;
  if (typeof target !== "string") return target;
  const element = document.querySelector(target);
  if (!element) throw new Error(`Target not found: ${target}`);
  return element as HTMLElement;
};

export const createTemplate = (html: string): HTMLElement => {
  const template = document.createElement("template");
  template.innerHTML = html;
  const element = template.content.firstElementChild!.cloneNode(true);
  return element as HTMLElement;
};

export const renderTemplate = (
  template: string,
  data: Record<string, string | number>,
): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(data[key] ?? ""),
  );
};

interface Listener {
  element: HTMLElement | ShadowRoot;
  event: string;
  handler: EventListenerOrEventListenerObject;
}

export class EventManager {
  private listeners: Listener[] = [];

  add(
    element: HTMLElement | ShadowRoot | null | undefined,
    event: string,
    handler: EventListenerOrEventListenerObject,
  ) {
    if (!element) return;
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }

  removeAll() {
    for (const { element, event, handler } of this.listeners) {
      element.removeEventListener(event, handler);
    }
    this.listeners = [];
  }
}
