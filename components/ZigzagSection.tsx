
"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ZIGZAG ITEMS — edit this array to change images, titles, and descriptions
// ↓ Put your images in /public/ and update the src paths below
// ─────────────────────────────────────────────────────────────────────────────
const ITEMS = [
  {
    src: "/sequence/ezgif-frame-001.jpg", // ← change to your own image
    tag: "Design",
    title: "Worlds built\nin three dimensions.",
    description:
      "We craft immersive 3D web experiences that feel alive. Every pixel is intentional — from the first frame to the last interaction.",
  },
  {
    src: "/sequence/ezgif-frame-090.jpg", // ← change to your own image
    tag: "Motion",
    title: "Motion that\ntells your story.",
    description:
      "Animation is our language. We translate your brand into fluid, cinematic movement that your audience remembers long after they scroll away.",
  },
  {
    src: "/sequence/ezgif-frame-180.jpg", // ← change to your own image
    tag: "Experience",
    title: "Experiences\nbeyond the screen.",
    description:
      "From concept to launch, Playful engineers digital products that feel like physical worlds — textured, weighted, and unforgettable.",
  },
  {
    src: "/sequence/ezgif-frame-270.jpg", // ← change to your own image (last frame)
    tag: "Agency",
    title: "A studio that\nthinks differently.",
    description:
      "We are a small, focused team obsessed with the intersection of technology and art. Book a session and let's build something extraordinary together.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function useRiseOnScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial hidden state
    el.style.opacity = "0";
    el.style.transform = "translateY(52px)";
    el.style.transition = "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function ZigzagItem({
  item,
  index,
}: {
  item: (typeof ITEMS)[0];
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  useRiseOnScroll(rowRef);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={rowRef}
      style={{
        display: "flex",
        flexDirection: isEven ? "row" : "row-reverse",
        alignItems: "center",
        gap: "clamp(32px, 6vw, 96px)",
        padding: "clamp(40px, 6vw, 80px) clamp(24px, 8vw, 120px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      // Responsive stacking via inline media (handled by max-width wrapper)
    >
      {/* ── IMAGE ───────────────────────────────────── */}
      <div
        style={{
          flex: "0 0 auto",
          width: "clamp(260px, 44vw, 560px)",
          aspectRatio: "4/3",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          background: "#111",
        }}
      >
        <img
          src={item.src}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            // Subtle scale-in on load feel
            transition: "transform 0.6s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        />
        {/* Subtle vignette on image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── TEXT ────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Tag / label */}
        <p
          style={{
            margin: "0 0 16px 0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            fontWeight: 500,
          }}
        >
          {/* ↓ CHANGE TAG */}
          {item.tag}
        </p>

        {/* Headline */}
        <h3
          style={{
            margin: "0 0 20px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(26px, 3.2vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.12,
            color: "#fff",
            letterSpacing: "-0.015em",
            whiteSpace: "pre-line",
          }}
        >
          {/* ↓ CHANGE HEADLINE */}
          {item.title}
        </h3>

        {/* Divider */}
        <div
          style={{
            width: "36px",
            height: "1px",
            background: "rgba(255,255,255,0.25)",
            marginBottom: "20px",
          }}
        />

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "clamp(14px, 1.3vw, 16px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 300,
            letterSpacing: "0.01em",
            maxWidth: "460px",
          }}
        >
          {/* ↓ CHANGE DESCRIPTION */}
          {item.description}
        </p>

        {/* Index number — decorative */}
        <div
          style={{
            marginTop: "32px",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(48px, 6vw, 80px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.04)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          0{index + 1}
        </div>
      </div>
    </div>
  );
}

export default function ZigzagSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  useRiseOnScroll(headerRef);

  return (
    <section
      style={{
        background: "#000",
        paddingTop: "clamp(60px, 8vw, 120px)",
      }}
    >
      {/* ── SECTION HEADER ─────────────────────────── */}
      <div
        ref={headerRef}
        style={{
          textAlign: "center",
          padding: "0 clamp(24px, 8vw, 120px) clamp(40px, 6vw, 80px)",
        }}
      >
        <p
          style={{
            margin: "0 0 16px 0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
          }}
        >
          {/* ↓ CHANGE SECTION EYEBROW */}
          What We Do
        </p>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 400,
            lineHeight: 1.12,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          {/* ↓ CHANGE SECTION HEADLINE */}
          Crafting the internet's<br />most cinematic websites.
        </h2>
      </div>

      {/* ── ZIGZAG ROWS ────────────────────────────── */}
      {ITEMS.map((item, i) => (
        <ZigzagItem key={i} item={item} index={i} />
      ))}
    </section>
  );
        }
