
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

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const frameIndexRef = useRef(0);
  const needsDrawRef = useRef(false);

  const { images, loaded, loadProgress, totalFrames } = useImageSequence();

  // Setup canvas DPR
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

  // Draw a specific frame immediately
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

  // RAF draw loop — only draws when flagged
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

    // Draw frame 0 immediately
    frameIndexRef.current = 0;
    drawFrame(0);

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

        // --- Frame sync ---
        const frameIdx = Math.floor(progress * (totalFrames - 1));
        if (frameIdx !== frameIndexRef.current) {
          frameIndexRef.current = frameIdx;
          needsDrawRef.current = true;
        }

        // --- Overlay ---
        const overlay = overlayRef.current;
        if (overlay) {
          if (progress >= 0.8) {
            const alpha = (progress - 0.8) / 0.2;
            overlay.style.opacity = String(Math.min(alpha, 1));
          } else {
            overlay.style.opacity = "0";
          }
        }

        // --- Text reveal ---
        const text = textRef.current;
        if (text) {
          if (progress >= 0.85) {
            const t = (progress - 0.85) / 0.15;
            const clamped = Math.min(t, 1);
            text.style.opacity = String(clamped);
            text.style.transform = `translateY(${40 - 40 * clamped}px)`;
          } else {
            text.style.opacity = "0";
            text.style.transform = "translateY(40px)";
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
      ScrollTrigger.getAll().forEach((t) => t.kill());
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
      {/* Loading screen */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            zIndex: 100,
            color: "#fff",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "0.2em",
            fontSize: "11px",
            textTransform: "uppercase",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "1px",
              background: "rgba(255,255,255,0.15)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "1px",
                background: "#fff",
                width: `${loadProgress * 100}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <span>{Math.round(loadProgress * 100)}%</span>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
        }}
      />

      {/* Black gradient overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Cinematic text reveal — right side */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          right: "6vw",
          bottom: "10vh",
          zIndex: 10,
          opacity: 0,
          transform: "translateY(40px)",
          maxWidth: "420px",
          textAlign: "right",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            margin: "0 0 12px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(11px, 1.1vw, 13px)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Scroll Experience
        </p>
        <h2
          style={{
            margin: "0 0 20px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(28px, 3.5vw, 52px)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          Every frame,<br />a breath.
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.02em",
            fontWeight: 300,
          }}
        >
          270 frames of cinematic motion,<br />
          perfectly synchronized to your scroll.
        </p>
      </div>
    </div>
  );
}
