
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

        // Reverse: progress 0 → last frame, progress 1 → first frame
        const frameIdx = Math.floor((1 - progress) * (totalFrames - 1));
        if (frameIdx !== frameIndexRef.current) {
          frameIndexRef.current = frameIdx;
          needsDrawRef.current = true;
        }

        // Black overlay fades up to 70% max
        const overlay = overlayRef.current;
        if (overlay) {
          const overlayOpacity = Math.min(progress / 0.18, 1) * 0.7;
          overlay.style.opacity = String(overlayOpacity);
        }

        // Center panel fades in after the overlay comes in
        const panel = panelRef.current;
        if (panel) {
          if (progress >= 0.14) {
            const t = Math.min((progress - 0.14) / 0.22, 1);
            panel.style.opacity = String(t);
            panel.style.transform = `translateY(${24 - 24 * t}px) scale(${0.96 + 0.04 * t})`;
          } else {
            panel.style.opacity = "0";
            panel.style.transform = "translateY(24px) scale(0.96)";
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

  const buttonGlow = {
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255, 140, 0, 0.28)",
  };

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

      {/* Black screen overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Floating panel */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          opacity: 0,
          transform: "translateY(24px) scale(0.96)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "min(92vw, 560px)",
            borderRadius: "28px",
            padding: "34px 28px",
            background:
              "linear-gradient(180deg, rgba(20,20,20,0.72), rgba(10,10,10,0.88))",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
            textAlign: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "18px",
            }}
          >
            <img
              src="/logo.jpg"
              alt="Playful logo"
              style={{
                width: "96px",
                height: "96px",
                objectFit: "cover",
                borderRadius: "22px",
                boxShadow:
                  "0 0 18px rgba(255,255,255,0.90), 0 0 44px rgba(255,255,255,0.42)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            />
          </div>

          <h2
            style={{
              margin: "0 0 14px 0",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(28px, 4.2vw, 54px)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Playful - design 3D website
          </h2>

          <p
            style={{
              margin: "0 auto 24px auto",
              maxWidth: "420px",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.68)",
              letterSpacing: "0.01em",
              fontWeight: 300,
            }}
          >
            Build cinematic, high-impact web experiences that feel premium,
            futuristic, and unforgettable.
          </p>

          <button
            type="button"
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "14px 24px",
              background: "linear-gradient(180deg, #ff9a1f, #ff7a00)",
              color: "#fff",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
              ...buttonGlow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.18), 0 0 24px rgba(255, 140, 0, 0.85), 0 0 64px rgba(255, 120, 0, 0.55), 0 16px 40px rgba(255, 120, 0, 0.30)";
              e.currentTarget.style.filter = "brightness(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px rgba(255, 140, 0, 0.28)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
            }
