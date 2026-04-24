"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvas({ images }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images.length) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.width;
      const ih = img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, iw * scale, ih * scale);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=350%",
        scrub: true,
        pin: true,
      },
    });

    const state = { frame: 0 };

    tl.to(state, {
      frame: images.length - 1,
      ease: "none",
      onUpdate: () => {
        draw(images[Math.round(state.frame)]);
      },
    });

    tl.to(
      overlayRef.current,
      { opacity: 1, duration: 0.4, ease: "power2.out" },
      ">-0.2"
    );

    tl.fromTo(
      textRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "<"
    );

    draw(images[0]);

    return () => {
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [images]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Cinematic Black Gradient */}
      <div
        ref={overlayRef}
        className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0"
      />

      {/* Title */}
      <div
        ref={textRef}
        className="absolute right-10 bottom-20 text-white opacity-0"
      >
        <h1 className="text-6xl font-extrabold tracking-widest">
          BUMBLE BEE
        </h1>
        <p className="mt-3 text-lg text-gray-300">
          Autonomous Scout Unit
        </p>
      </div>
    </section>
  );
}
