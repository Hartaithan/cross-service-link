const STORAGE_KEY = "csl-never-show";

export const storage = {
  getNeverShow(): boolean {
    try {
      const value = localStorage.getItem(STORAGE_KEY) === "true";
      if (value) console.info("[cross-service-link]: never show set");
      return value;
    } catch {
      return false;
    }
  },
  setNeverShow(value: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      console.warn("[cross-service-link]: local storage not available");
    }
  },
};
