"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Violet orb — top left */}
      <div
        className="absolute rounded-full animate-float-slow"
        style={{
          width: 700,
          height: 700,
          top: "-20%",
          left: "-15%",
          background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "0s",
        }}
      />
      {/* Cyan orb — bottom right */}
      <div
        className="absolute rounded-full animate-float-medium"
        style={{
          width: 550,
          height: 550,
          bottom: "-15%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "3s",
        }}
      />
      {/* Subtle violet glow — center */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
