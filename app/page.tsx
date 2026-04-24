
// app/page.tsx
"use client";

import { useImageSequence } from "@/hooks/useImageSequence";
import HeroCanvas from "@/components/HeroCanvas";
import FleetRoster from "@/components/FleetRoster";
import FooterCanvas from "@/components/FooterCanvas";

const TOTAL_FRAMES = 270;

export default function Home() {
  const { images, isReady, loadedProgress } = useImageSequence(
    TOTAL_FRAMES,
    "/sequence/ezgif-frame-",
    ".jpg"
  );

  if (!isReady) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white text-gray-900">
        <div className="mb-6 animate-pulse text-xl font-bold uppercase tracking-[0.2em] text-gray-400">
          Loading Assets
        </div>
        <div className="h-1.5 w-64 overflow-hidden rounded-full bg-gray-100 shadow-inner">
          <div
            className="h-full bg-gray-900 transition-all duration-300 ease-out"
            style={{ width: `${loadedProgress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroCanvas images={images} />
      <FleetRoster />
      <FooterCanvas images={images} />
    </main>
  );
}
