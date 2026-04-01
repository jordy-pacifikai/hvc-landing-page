"use client";

export default function ParticlesBackground() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: `-${p.size}px`,
              background: p.color,
              opacity: p.opacity,
              animation: `particleRise ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes particleRise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--particle-opacity, 0.3);
          }
          90% {
            opacity: var(--particle-opacity, 0.3);
          }
          100% {
            transform: translateY(-110vh) translateX(var(--particle-drift, 20px));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => {
  const seed = i * 137.508;
  const hash = (n: number) => ((Math.sin(n) * 10000) % 1 + 1) % 1;

  const size = 1 + hash(seed) * 3;
  const left = `${(hash(seed + 1) * 100).toFixed(1)}%`;
  const duration = 15 + hash(seed + 2) * 25;
  const delay = hash(seed + 3) * 20;
  const opacity = 0.1 + hash(seed + 4) * 0.3;

  const colors = [
    "rgba(37, 99, 235, 0.5)",   // accent blue
    "rgba(59, 130, 246, 0.4)",  // lighter blue
    "rgba(245, 240, 235, 0.2)", // ivory
  ];
  const color = colors[i % 3];

  return { size, left, duration, delay, opacity, color };
});
