/**
 * JSDOM stability/polyfills for website tests.
 */

type Listener = (...args: unknown[]) => void;

const makeSpy = (): Listener => {
  const fn: Listener = () => {};
  return fn;
};

function makeStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
}

if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: makeStorage(),
    configurable: true,
  });
  Object.defineProperty(window, "sessionStorage", {
    value: makeStorage(),
    configurable: true,
  });

  if (!window.matchMedia) {
    window.matchMedia = (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: makeSpy(),
        removeListener: makeSpy(),
        addEventListener: makeSpy(),
        removeEventListener: makeSpy(),
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  if (!globalThis.ResizeObserver) {
    class ResizeObserverPolyfill {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }

    globalThis.ResizeObserver = ResizeObserverPolyfill;
  }

  if (!window.scrollTo) {
    window.scrollTo = makeSpy() as unknown as typeof window.scrollTo;
  }

  if (!globalThis.TextEncoder) {
    globalThis.TextEncoder = TextEncoder;
  }
  if (!globalThis.TextDecoder) {
    globalThis.TextDecoder = TextDecoder;
  }
}
