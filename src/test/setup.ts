import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const storage = (() => {
  let data: Record<string, string> = {};

  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    removeItem: (key: string) => {
      delete data[key];
    },
    clear: () => {
      data = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: storage,
});

Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  value: storage,
});
