/** One shared IntersectionObserver for every Hand / InkText on the page. */
type Callback = (entry: IntersectionObserverEntry) => void;

const callbacks = new WeakMap<Element, Callback>();
let io: IntersectionObserver | null = null;

function get(): IntersectionObserver {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) callbacks.get(entry.target)?.(entry);
      },
      // no negative margin and threshold 0: text is hidden from first paint, so
      // a block must be allowed to start as soon as any of it is on screen
      { rootMargin: '0px', threshold: 0 },
    );
  }
  return io;
}

export function observe(el: Element, cb: Callback): void {
  callbacks.set(el, cb);
  get().observe(el);
}

export function unobserve(el: Element): void {
  callbacks.delete(el);
  io?.unobserve(el);
}
