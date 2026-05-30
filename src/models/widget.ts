export interface WidgetEvents {
  onLinkClick?: (link: string) => void;
  onLearnMoreClick?: () => void;
  onNeverShowClick?: () => void;
}

export interface Options {
  target: string;
  events?: WidgetEvents;
}
