export const getImageURL = (path: string): string => {
  const url = import.meta.env.VITE_BASE_URL ?? "";
  if (!path || path.startsWith("http")) return path;
  return `${url.replace(/\/+$/, "")}${path}`;
};
