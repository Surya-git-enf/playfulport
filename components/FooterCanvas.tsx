
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterCanvas({ images }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        const frame = Math.floor((1 - self.progress) * (images.length - 1));
        draw(frame);
      },
    });

    draw(images.length - 1);
  }, [images]);

  return (
    <section ref={containerRef} className="relative h-screen w-full">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </section>
  );
}
