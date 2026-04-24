
"use client";

import { useImageSequence } from "@/hooks/useImageSequence";
import HeroCanvas from "@/components/HeroCanvas";
import FooterCanvas from "@/components/FooterCanvas";

export default function Home() {
  const { images, isReady, loadedProgress } = useImageSequence(
    270,
    "/sequence/ezgif-frame-",
    ".jpg"
  );

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading {loadedProgress}%
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
