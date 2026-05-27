"use client";

interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color = "#7C3AED" }: SpinnerProps) {
  return (
    <span
      className="inline-block rounded-full border-2 border-t-transparent animate-spin"
      style={{
        width: size,
        height: size,
        borderColor: `${color}40`,
        borderTopColor: color,
        filter: `drop-shadow(0 0 4px ${color})`,
      }}
    />
  );
}
