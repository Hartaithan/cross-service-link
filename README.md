# Cross Service Link

A self-contained embeddable widget for cross-promoting trophy-related services. Displays a floating card with a carousel modal, fully isolated via Shadow DOM.

## How It Works

- Uses a **two-file loading strategy**: stable `loader.js` + content-hashed `widget.[hash].js`
- **Shadow DOM** keeps widget styles isolated from the host page
- **Persistence**: stores `csl-never-show` in `localStorage` — if set, widget never mounts again
- **Auto-filtering**: hides the current site's own service from the carousel

## Usage

```html
<script type="module" src="https://your-cdn.example.com/loader.js"></script>
<script type="module" defer>
  const onLinkClick = (link) => console.log("link clicked", link);
  const onLearnMoreClick = () => console.log("learn more click");
  const onNeverShowClick = () => console.log("never show click");
  const events = { onLinkClick, onLearnMoreClick, onNeverShowClick };
  window.CrossServiceLink.ready.then(() => {
    const options = { target: "#app", theme: "light", events };
    const widget = new window.CrossServiceLink(options);
    widget.mount();
  });
</script>
```
