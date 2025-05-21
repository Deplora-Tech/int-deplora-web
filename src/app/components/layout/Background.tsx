"use client";

export function Background() {
  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#010101]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,170,255,0.01),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay" />
      <style jsx global>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
