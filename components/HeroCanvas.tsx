
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { drawImageProp } from "@/utils/canvas";

gsap.registerPlugin(ScrollTrigger);

interface HeroCanvasProps {
  images: HTMLImageElement[];
}

export default function HeroCanvas({ images }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images.length || !canvasRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderFrame = (index: number) => {
      const safeIndex = Math.max(0, Math.min(images.length - 1, index));
      drawImageProp(ctx, images[safeIndex], canvas);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderFrame(0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const state = { frame: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      },
    });

    tl.to(state, {
      frame: images.length - 1,
      ease: "none",
      duration: 1,
      snap: "frame",
      onUpdate: () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          renderFrame(Math.round(state.frame));
        });
      },
    });

    tl.to(
      overlayRef.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      },
      ">"
    );

    tl.fromTo(
      textPanelRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
      "<0.05"
    );

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl.kill();
    };
  }, [images]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#f6f7fb]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute bottom-0 z-10 h-[10%] w-full bg-gradient-to-t from-white/90 to-transparent" />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute bottom-0 z-20 h-2/5 w-full translate-y-full bg-gradient-to-t from-white via-white/95 to-transparent opacity-0"
      />

      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-end px-6 md:px-16">
        <div
          ref={textPanelRef}
          className="max-w-md rounded-3xl border border-white/70 bg-white/45 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl opacity-0 md:p-10"
        >
          <h1 className="mb-4 text-4xl font-black uppercase tracking-[0.18em] text-gray-900 md:text-5xl">
            The Prime Sentinel
          </h1>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg">
            Heavy artillery. Unbreakable will. The commander of the fleet has arrived.
          </p>
        </div>
      </div>
    </section>
  );
}
