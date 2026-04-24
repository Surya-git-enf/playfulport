
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvas({ images }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images.length) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = (index: number) => {
      const img = images[index];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=400%",
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        const frame = Math.floor(self.progress * (images.length - 1));
        draw(frame);

        // overlay reveal
        if (self.progress > 0.7) {
          const p = (self.progress - 0.7) / 0.3;
          gsap.to(overlayRef.current, { opacity: p });
          gsap.to(textRef.current, { opacity: p, y: 0 });
        }
      },
    });

    draw(0);
  }, [images]);

  return (
    <section ref={containerRef} className="relative h-screen w-full">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* BLACK SHADOW */}
      <div
        ref={overlayRef}
        className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-0"
      />

      {/* TEXT */}
      <div
        ref={textRef}
        className="absolute right-10 bottom-20 text-white opacity-0 translate-y-10"
      >
        <h1 className="text-5xl font-bold">Bumble Bee</h1>
        <p className="mt-2 text-lg">Autonomous scout unit</p>
      </div>
    </section>
  );
}
