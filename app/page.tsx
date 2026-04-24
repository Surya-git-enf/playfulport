
"use client";

import { useImageSequence } from "@/hooks/useImageSequence";
import HeroCanvas from "@/components/HeroCanvas";
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
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4 tracking-widest text-gray-400">LOADING</p>
          <div className="w-64 h-[2px] bg-gray-800">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${loadedProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-black">
      <HeroCanvas images={images} />
      <FooterCanvas images={images} />
    </main>
  );
}
