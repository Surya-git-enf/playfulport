
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useImageSequence } from "@/hooks/useImageSequence";

gsap.registerPlugin(ScrollTrigger);

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasW / canvasH;
  let drawW: number, drawH: number, offsetX: number, offsetY: number;

  if (imgRatio > canvasRatio) {
    drawH = canvasH;
    drawW = drawH * imgRatio;
    offsetX = (canvasW - drawW) / 2;
    offsetY = 0;
  } else {
    drawW = canvasW;
    drawH = drawW / imgRatio;
    offsetX = 0;
    offsetY = (canvasH - drawH) / 2;
  }

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

export default function FooterCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const frameIndexRef = useRef(269);
  const needsDrawRef = useRef(false);

  const { images, loaded, totalFrames } = useImageSequence();

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  };

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imgs = images.current;
    if (!imgs || imgs.length === 0) return;
    const img = imgs[Math.max(0, Math.min(index, imgs.length - 1))];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    drawCover(ctx, img, canvas.width / dpr, canvas.height / dpr);
  };

  const startRAF = () => {
    const loop = () => {
      if (needsDrawRef.current) {
        drawFrame(frameIndexRef.current);
        needsDrawRef.current = false;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (!loaded) return;

    setupCanvas();

    // Start at last frame (reversed)
    frameIndexRef.current = totalFrames - 1;
    drawFrame(totalFrames - 1);

    startRAF();

    const section = sectionRef.current!;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Reverse: progress 0 → frame 269, progress 1 → frame 0
        const frameIdx = Math.floor((1 - progress) * (totalFrames - 1));
        if (frameIdx !== frameIndexRef.current) {
          frameIndexRef.current = frameIdx;
          needsDrawRef.current = true;
        }

        // Text: fades in during first 20% of footer scroll
        const text = textRef.current;
        if (text) {
          if (progress <= 0.2) {
            const t = progress / 0.2;
            text.style.opacity = String(Math.min(t, 1));
            text.style.transform = `translateY(${40 - 40 * t}px)`;
          } else if (progress >= 0.8) {
            const t = (progress - 0.8) / 0.2;
            text.style.opacity = String(Math.max(1 - t, 0));
            text.style.transform = `translateY(${-20 * t}px)`;
          } else {
            text.style.opacity = "1";
            text.style.transform = "translateY(0)";
          }
        }
      },
    });

    const handleResize = () => {
      setupCanvas();
      drawFrame(frameIndexRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Centered closing text */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          opacity: 0,
          transform: "translateY(40px)",
          pointerEvents: "none",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            margin: "0 0 16px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(11px, 1vw, 13px)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          The journey ends
        </p>
        <h2
          style={{
            margin: "0 0 24px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(32px, 5vw, 72px)",
            fontWeight: 300,
            lineHeight: 1.05,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          Back to<br />the beginning.
        </h2>
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(255,255,255,0.3)",
          }}
        />
      </div>
    </div>
  );
      }
