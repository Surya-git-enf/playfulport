// app/page.tsx
"use client";
import { useImageSequence } from '@/hooks/useImageSequence';
import HeroCanvas from '@/components/HeroCanvas';
import FleetRoster from '@/components/FleetRoster';
import FooterCanvas from '@/components/FooterCanvas';

const TOTAL_FRAMES = 270;

export default function Home() {
  const { images, isReady, loadedProgress } = useImageSequence(
    TOTAL_FRAMES, 
    '/sequence/ezgif-frame-', 
    '.png'
  );

  if (!isReady) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <div className="text-xl font-bold tracking-[0.2em] uppercase mb-6 text-gray-400 animate-pulse">
          Loading Assets
        </div>
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gray-900 transition-all duration-300 ease-out"
            style={{ width: `${loadedProgress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <HeroCanvas images={images} />
      <FleetRoster />
      <FooterCanvas images={images} />
    </main>
  );
}

