
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

        // Frame sync
        const frameIdx = Math.floor(progress * (totalFrames - 1));
        if (frameIdx !== frameIndexRef.current) {
          frameIndexRef.current = frameIdx;
          needsDrawRef.current = true;
        }

        // Overlay — solid black rises from bottom, full coverage by 100%
        const overlay = overlayRef.current;
        if (overlay) {
          if (progress >= 0.75) {
            const alpha = (progress - 0.75) / 0.25;
            const clamped = Math.min(alpha, 1);
            overlay.style.opacity = String(clamped);
            // Height grows from 40% to 100% of screen
            const heightPct = 40 + 60 * clamped;
            overlay.style.height = `${heightPct}%`;
          } else {
            overlay.style.opacity = "0";
            overlay.style.height = "40%";
          }
        }

        // Text reveal
        const text = textRef.current;
        if (text) {
          if (progress >= 0.82) {
            const t = Math.min((progress - 0.82) / 0.18, 1);
            text.style.opacity = String(t);
            text.style.transform = `translateY(${40 - 40 * t}px)`;
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
          <div style={{ marginBottom: "8px", fontSize: "22px", letterSpacing: "0.15em" }}>
            Playful
          </div>
          <div
            style={{
              width: "220px",
              height: "2px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                background: "#fff",
                width: `${loadProgress * 100}%`,
                transition: "width 0.1s linear",
                borderRadius: "2px",
              }}
            />
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>
            {Math.round(loadProgress * 100)}%
          </span>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />

      {/* 
        ─────────────────────────────────────────────────
        BLACK OVERLAY — rises from bottom like a curtain
        ─────────────────────────────────────────────────
        Starts at bottom, grows upward to full screen.
        Solid black — you WILL feel it.
      */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "#000",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 2,
          // Soft edge at the top of the curtain
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
        }}
      />

      {/* 
        Text panel — appears on top of the black curtain
        ─── TO CHANGE TEXT: edit the strings below ───
        ─── TO CHANGE BRAND NAME: replace "Playful" ──
      */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          right: "6vw",
          bottom: "8vh",
          zIndex: 10,
          opacity: 0,
          transform: "translateY(40px)",
          maxWidth: "440px",
          textAlign: "right",
          pointerEvents: "none",
        }}
      >
        {/* ↓ CHANGE BRAND LABEL HERE */}
        <p
          style={{
            margin: "0 0 10px 0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "clamp(10px, 1vw, 12px)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
          }}
        >
          Playful Studio
        </p>

        {/* ↓ CHANGE HEADLINE HERE */}
        <h2
          style={{
            margin: "0 0 18px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(30px, 4vw, 58px)",
            fontWeight: 400,
            lineHeight: 1.08,
            color: "#ffffff",
            letterSpacing: "-0.015em",
          }}
        >
          Every frame,<br />a breath.
        </h2>

        {/* ↓ CHANGE BODY TEXT HERE */}
        <p
          style={{
            margin: 0,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.65)",
            letterSpacing: "0.01em",
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
