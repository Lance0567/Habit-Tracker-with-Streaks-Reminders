import { useState, useEffect } from "react";
import { format } from "date-fns";

export function useLocalTime() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  void tick;
  const now = new Date();
  return {
    time: format(now, "HH:mm"),
    date: format(now, "yyyy-MM-dd"),
    formatted: format(now, "EEEE, MMMM d · yyyy"),
  };
}
