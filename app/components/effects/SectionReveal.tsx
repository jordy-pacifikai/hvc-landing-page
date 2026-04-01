"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  onReveal?: () => void;
}

export default function SectionReveal({
  children,
  className = "",
  stagger = 0.1,
  y = 40,
  onReveal,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll(".reveal-child");
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y,
        opacity: 0,
        stagger: stagger * 0.6,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: onReveal,
        },
      });
    });

    return () => ctx.revert();
  }, [stagger, y, onReveal]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
