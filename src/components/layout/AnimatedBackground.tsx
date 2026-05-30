"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary accent orb — top left, follows theme color */}
      <div
        className="absolute rounded-full animate-float-slow"
        style={{
          width: 700,
          height: 700,
          top: "-20%",
          left: "-15%",
          background: "radial-gradient(circle, var(--accent-orb-strong) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "0s",
          transition: "background 0.6s ease",
        }}
      />
      {/* Secondary accent orb — bottom right, softer */}
      <div
        className="absolute rounded-full animate-float-medium"
        style={{
          width: 550,
          height: 550,
          bottom: "-15%",
          right: "-10%",
          background: "radial-gradient(circle, var(--accent-orb-medium) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "3s",
          transition: "background 0.6s ease",
        }}
      />
      {/* Subtle centre glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, var(--accent-orb-subtle) 0%, transparent 70%)",
          filter: "blur(60px)",
          transition: "background 0.6s ease",
        }}
      />
      {/* Grid texture overlay — color adapts per theme via CSS variable */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px),
                            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transition: "background-image 0.6s ease",
        }}
      />
    </div>
  );
}
