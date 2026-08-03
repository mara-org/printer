"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Stage = "idle" | "drop" | "analyze" | "result";

const SEQUENCE: Stage[] = ["idle", "drop", "analyze", "result"];
const DURATIONS: Record<Stage, number> = { idle: 1500, drop: 1500, analyze: 2200, result: 4500 };

/**
 * Auto-cycling CSS animation that mimics the upload → analyze → result flow.
 * If `/demo.mp4` exists in /public, that video is used instead.
 */
export function HeroDemo({ videoSrc }: { videoSrc?: string }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [hasVideo, setHasVideo] = useState<boolean | null>(null);

  // Probe for the video once on mount.
  useEffect(() => {
    if (!videoSrc) {
      setHasVideo(false);
      return;
    }
    fetch(videoSrc, { method: "HEAD" })
      .then((r) => setHasVideo(r.ok))
      .catch(() => setHasVideo(false));
  }, [videoSrc]);

  // Cycle through stages.
  useEffect(() => {
    if (hasVideo) return;
    const idx = SEQUENCE.indexOf(stage);
    const next = SEQUENCE[(idx + 1) % SEQUENCE.length];
    const timer = setTimeout(() => setStage(next), DURATIONS[stage]);
    return () => clearTimeout(timer);
  }, [stage, hasVideo]);

  if (hasVideo) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lg">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lg">
      {/* Fake browser chrome */}
      <div className="flex h-7 items-center gap-1.5 border-b border-ink/5 bg-ink/[0.03] px-3">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <span className="ml-3 truncate text-[10px] text-ink/40">paperlens.app/upload</span>
      </div>

      <div className="relative h-[calc(100%-1.75rem)] p-4">
        {/* Stage 1+2: drop zone */}
        <div
          className={cn(
            "absolute inset-4 flex items-center justify-center rounded-xl border-2 border-dashed transition-all duration-500",
            stage === "drop"
              ? "border-accent bg-accent/5"
              : stage === "idle"
                ? "border-ink/15 bg-white"
                : "border-ink/10 bg-white opacity-0",
          )}
        >
          <div className="text-center">
            <p className="text-xs font-medium text-ink/70">Drop a document here</p>
            <p className="mt-1 text-[10px] text-ink/40">PDF · JPG · PNG · up to 20 MB</p>
          </div>

          {/* Floating doc */}
          <div
            className={cn(
              "absolute h-20 w-16 rounded-md border border-ink/10 bg-white shadow-md transition-all duration-1000 ease-out",
              stage === "idle" ? "top-[-30%] left-[10%] opacity-0" : "",
              stage === "drop" ? "top-[35%] left-[42%] opacity-100" : "",
              stage === "analyze" || stage === "result" ? "left-[42%] top-[40%] opacity-0" : "",
            )}
          >
            <div className="space-y-1 p-1.5">
              <div className="h-1 w-8 rounded bg-ink/20" />
              <div className="h-1 w-10 rounded bg-ink/15" />
              <div className="h-1 w-7 rounded bg-ink/15" />
              <div className="mt-2 h-1 w-9 rounded bg-ink/15" />
              <div className="h-1 w-11 rounded bg-ink/15" />
            </div>
          </div>
        </div>

        {/* Stage 3: analyzing */}
        <div
          className={cn(
            "absolute inset-4 flex items-center justify-center transition-opacity duration-500",
            stage === "analyze" ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="mt-3 text-xs font-medium text-ink/70">Analyzing with Gemini 2.5…</p>
            <p className="mt-1 text-[10px] text-ink/40">~9 seconds</p>
          </div>
        </div>

        {/* Stage 4: result */}
        <div
          className={cn(
            "absolute inset-4 flex flex-col gap-2 overflow-hidden transition-all duration-700",
            stage === "result" ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
              Lease
            </span>
            <span className="text-[10px] text-ink/40">Confidence 0.94</span>
          </div>
          <p className="text-xs font-semibold tracking-tight">Summary</p>
          <p className="line-clamp-2 text-[11px] leading-snug text-ink/70">
            12-month lease starting Mar 1. $2,150/mo with $4,300 deposit. Auto-renews
            month-to-month unless 60 days notice. Pets +$400 non-refundable.
          </p>
          <p className="mt-1 text-xs font-semibold tracking-tight">Risks flagged</p>
          <ul className="space-y-1">
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 inline-block rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0 text-[9px] font-medium text-amber-800">
                Med
              </span>
              <span className="text-[11px] leading-snug text-ink/75">
                Auto-renewal — easy to miss the 60-day window
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-0.5 inline-block rounded-full border border-red-200 bg-red-50 px-1.5 py-0 text-[9px] font-medium text-red-800">
                High
              </span>
              <span className="text-[11px] leading-snug text-ink/75">
                Non-refundable pet fee — restricted in some states
              </span>
            </li>
          </ul>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-4 bottom-2 h-1 overflow-hidden rounded-full bg-ink/5">
          <div
            className="h-full bg-accent transition-all"
            style={{
              width:
                stage === "idle"
                  ? "10%"
                  : stage === "drop"
                    ? "35%"
                    : stage === "analyze"
                      ? "70%"
                      : "100%",
              transitionDuration: `${DURATIONS[stage]}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
