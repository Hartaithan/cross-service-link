import type { Item } from "../models/item";

export const items: Item[] = [
  {
    id: "platinum-calendar",
    title: "Platinum Calendar",
    description:
      "Visualize your progress by generating a custom calendar that displays the exact days you earned your platinum trophies throughout the year",
    link: "https://platinum-calendar.vercel.app",
    image_url: "/items/platinum-calendar.webp",
    image_background: "#FFFFFF",
  },
  {
    id: "a-z-platinum",
    title: "A-Z Platinum Challenge",
    description:
      "Track your journey to earn platinum trophies for games starting with every letter from A to Z. Organize completed titles, monitor missing letters, discover new challenges, and showcase your overall progress through a clean and engaging interface built for dedicated trophy hunters.",
    link: "https://a-z-platinum.vercel.app",
    image_url: "/items/a-z-platinum.webp",
    image_background: "#FFFFFF",
  },
  {
    id: "profile-percentage",
    title: "Profile Completion Calculator",
    description:
      "Calculate your PlayStation profile completion percentage, track your trophy progress, estimate future achievements, and preview trophy unlocks to plan your path toward the maximum possible completion rate",
    link: "https://profile-percentage.vercel.app",
    image_url: "/items/profile-percentage.webp",
    image_background: "#02040b",
  },
];
