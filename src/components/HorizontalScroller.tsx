import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HorizontalScrollerProps = {
  children: ReactNode;
};

export default function HorizontalScroller({ children }: HorizontalScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const updateScrollState = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir === "right" ? 400 : -400,
      behavior: "smooth",
    });
  };

  return (
    <div className="group relative">
      {canScrollLeft ? (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-100 transition hover:bg-black"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      ) : null}

      <div ref={ref} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        {children}
      </div>

      {canScrollRight ? (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-100 transition hover:bg-black"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      ) : null}
    </div>
  );
}
