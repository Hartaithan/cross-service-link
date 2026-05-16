import { CrossServiceLink } from "./widget";

declare global {
  interface Window {
    CrossServiceLink: typeof CrossServiceLink;
  }
}

if (typeof window !== "undefined") {
  window.CrossServiceLink = CrossServiceLink;
}

export { CrossServiceLink };
