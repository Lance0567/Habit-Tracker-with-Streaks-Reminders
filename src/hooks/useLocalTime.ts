import { useState, useEffect } from "react";
import { format } from "date-fns";

export function useLocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return {
    time:      now ? format(now, "HH:mm") : "",
    date:      now ? format(now, "yyyy-MM-dd") : "",
    formatted: now ? format(now, "EEEE, MMMM d · yyyy") : "",
  };
}
