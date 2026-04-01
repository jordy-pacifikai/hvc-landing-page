"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface RotatingTextProps {
  prefix: string;
  words: string[];
  className?: string;
  interval?: number;
}

export default function RotatingText({
  prefix,
  words,
  className = "",
  interval = 3000,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [minWidth, setMinWidth] = useState(0);

  // Measure the widest word once on mount to prevent layout shifts
  useEffect(() => {
    if (!measureRef.current) return;
    let max = 0;
    const el = measureRef.current;
    for (const w of words) {
      el.textContent = w;
      max = Math.max(max, el.offsetWidth);
    }
    setMinWidth(max + 4); // +4px safety margin
  }, [words]);

  useEffect(() => {
    if (!hasAnimated.current && wordRef.current) {
      gsap.fromTo(
        wordRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );
      hasAnimated.current = true;
    }

    const id = setInterval(() => {
      if (!wordRef.current) return;
      gsap.to(wordRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIndex((prev) => (prev + 1) % words.length);
          if (wordRef.current) {
            gsap.fromTo(
              wordRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
          }
        },
      });
    }, interval);

    return () => clearInterval(id);
  }, [words, interval]);

  return (
    <span className={className}>
      {prefix}{" "}
      {/* Hidden measurer — same font/size, invisible */}
      <span
        ref={measureRef}
        className="inline-block gradient-text-blue absolute invisible whitespace-nowrap"
        aria-hidden="true"
      />
      <span
        ref={wordRef}
        className="inline-block gradient-text-blue text-center"
        style={{ minWidth: minWidth > 0 ? minWidth : undefined }}
      >
        {words[index]}
      </span>
    </span>
  );
}
