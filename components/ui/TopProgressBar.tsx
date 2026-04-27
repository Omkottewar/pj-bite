"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Start loading on route change
    setLoading(true);
    setProgress(15);

    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Simulate incremental progress
    let current = 15;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 90) {
        current = 90;
        clearInterval(intervalRef.current!);
      }
      setProgress(current);
    }, 200);

    // Complete after short delay (route has changed = page ready)
    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 400);
    }, 600);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* ── Thin top progress bar (YouTube / GitHub style) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[9998] pointer-events-none"
        style={{ height: "3px" }}
      >
        <div
          className="h-full transition-all ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #1e6628, #a3c96e, #1e6628)",
            backgroundSize: "200% 100%",
            animation: loading ? "shimmer-bar 1.2s linear infinite" : "none",
            boxShadow: "0 0 10px rgba(163,201,110,0.6), 0 0 4px rgba(163,201,110,0.4)",
            borderRadius: "0 4px 4px 0",
            transition: loading ? "width 0.3s ease-out" : "width 0.4s ease-out, opacity 0.3s",
            opacity: progress === 100 ? 0 : 1,
          }}
        />
        {/* Glowing dot at the tip */}
        {loading && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              left: `calc(${progress}% - 8px)`,
              background: "#a3c96e",
              boxShadow: "0 0 8px 2px rgba(163,201,110,0.8)",
              opacity: progress > 5 && progress < 98 ? 1 : 0,
              transition: "left 0.3s ease-out",
            }}
          />
        )}
      </div>

      {/* ── Leaf spinner in top-right corner during navigation ── */}
      {loading && (
        <div className="fixed top-4 right-4 z-[9998] pointer-events-none">
          <div
            className="w-6 h-6 text-brand-primary"
            style={{
              animation: "spin 1s linear infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🌿
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer-bar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
