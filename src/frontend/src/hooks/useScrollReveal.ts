import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        }
      },
      { threshold: 0.12 },
    );

    for (const el of document.querySelectorAll(".scroll-reveal")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}
