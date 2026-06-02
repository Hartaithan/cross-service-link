declare global {
  namespace CrossServiceLink {
    interface Item {
      id: string;
      title: string;
      short_title: string;
      description: string;
      link: string;
      image_url: string;
      image_background: string;
    }

    interface Events {
      onLinkClick?: (link: string) => void;
      onLearnMoreClick?: () => void;
      onNeverShowClick?: () => void;
    }

    type Theme = "dark" | "light";

    interface Options {
      target: string | HTMLElement;
      events?: Events;
      theme?: Theme;
    }

    interface Instance {
      mount(onMounted?: () => void): Promise<void>;
      destroy(): Promise<void>;
    }

    interface Constructor {
      new (options: Options): Instance;
    }
  }

  interface Window {
    CrossServiceLink: CrossServiceLink.Constructor;
  }
}

export {};
