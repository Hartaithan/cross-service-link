export interface WidgetEvents {
  onLinkClick?: (link: string) => void;
  onLearnMoreClick?: () => void;
  onNeverShowClick?: () => void;
}

export type Theme = "dark" | "light";

export interface Options {
  target: string;
  events?: WidgetEvents;
  theme?: Theme;
}
