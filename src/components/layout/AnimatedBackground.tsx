"use client";

export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ transition: "background 0.5s ease" }}
    >
      {/* Static radial gradient — top-left accent, bottom-right neutral */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 0% 0%, var(--accent-orb-strong) 0%, transparent 100%),
            radial-gradient(ellipse 50% 40% at 100% 100%, var(--accent-orb-medium) 0%, transparent 100%),
            var(--bg-base)
          `,
          transition: "background 0.5s ease",
        }}
      />
    </div>
  );
}
