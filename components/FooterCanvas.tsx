
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { drawImageProp } from "@/utils/canvas";

gsap.registerPlugin(ScrollTrigger);

interface FooterCanvasProps {
  images: HTMLImageElement[];
}

export default function FooterCanvas({ images }: FooterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
      renderFrame(images.length - 1);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const state = { progress: 0 };

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
      progress: 1,
      ease: "none",
      duration: 1,
      onUpdate: () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const reverseIndex = Math.round((1 - state.progress) * (images.length - 1));
          renderFrame(reverseIndex);
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
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
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

      <div className="absolute inset-0 z-30 flex items-end justify-center px-6 pb-10 md:pb-14">
        <div
          ref={ctaRef}
          className="pointer-events-auto flex flex-col items-center rounded-3xl border border-white/70 bg-white/55 px-8 py-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl opacity-0 md:px-10"
        >
          <img
            src="logo.png"
            alt="Playful logo"
            className="playful-bounce mb-4 h-16 w-16"
          />
          <h2 className="text-3xl font-black uppercase tracking-[0.14em] text-gray-900">
            Playful
          </h2>
          <p className="mt-2 text-base text-gray-700">3D website builder.</p>
          <button className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
            Book now
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 z-40 w-full border-t border-gray-300/80" />
    </section>
  );
}
