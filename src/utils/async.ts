export const delay = (ms: number) => {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
};
