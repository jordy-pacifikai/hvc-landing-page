"use client";

import { useRef, useCallback } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glowColor?: string;
}

export default function GlassCard({
  children,
  className = "",
  tilt = true,
  glowColor = "rgba(37, 99, 235, 0.07)",
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (tilt) {
        cardRef.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      }
      cardRef.current.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
      cardRef.current.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    },
    [tilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    if (tilt) {
      cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
    }
  }, [tilt]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass relative transition-transform duration-300 group ${className}`}
      style={{ willChange: tilt ? "transform" : undefined }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${glowColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
