
"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// DATA (3 sections only)
// ─────────────────────────────────────────────────────────────
const ITEMS = [
  {
    src: "/transformers/bumble.jpg",
    tag: "Autobot",
    title: "The scout arrives\nin the silence of war.",
    description:
      "Fast, fearless, and built for motion. A cinematic entry that sets the tone with energy, tension, and precision.",
  },
  {
    src: "/transformers/Optimus.jpg",
    tag: "Leader",
    title: "A hero forged\nfrom steel and purpose.",
    description:
      "Strong, noble, and unmistakable. The centerpiece of the story — commanding presence and visual dominance.",
  },
  {
    src: "/transformers/megatron.jpg",
    tag: "Threat",
    title: "Power rises\nfrom the shadows.",
    description:
      "Dark, intense, and overwhelming. A final frame that leaves a lasting, powerful impression.",
  },
];

// ─────────────────────────────────────────────────────────────
// SCROLL ANIMATION HOOK
// ─────────────────────────────────────────────────────────────
function useRiseOnScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(60px)";
    el.style.transition =
      "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";

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

// ─────────────────────────────────────────────────────────────
// SINGLE ZIGZAG ITEM
// ─────────────────────────────────────────────────────────────
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
        gap: "clamp(30px, 6vw, 90px)",
        padding: "clamp(50px, 7vw, 100px) clamp(20px, 8vw, 120px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(255,255,255,0.08) inset",
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          flex: "0 0 auto",
          width: "clamp(260px, 42vw, 560px)",
          aspectRatio: "4/3",
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",
          background: "#0b0b0b",
        }}
      >
        <img
          src={item.src}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.3), transparent)",
          }}
        />
      </div>

      {/* TEXT */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            marginBottom: "12px",
            fontSize: "11px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {item.tag}
        </p>

        <h3
          style={{
            marginBottom: "18px",
            fontSize: "clamp(28px, 3.5vw, 56px)",
            lineHeight: 1.1,
            color: "#fff",
            whiteSpace: "pre-line",
          }}
        >
          {item.title}
        </h3>

        <div
          style={{
            width: "50px",
            height: "1px",
            background: "rgba(255,255,255,0.6)",
            marginBottom: "18px",
          }}
        />

        <p
          style={{
            maxWidth: "520px",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {item.description}
        </p>

        <div
          style={{
            marginTop: "30px",
            fontSize: "clamp(50px, 6vw, 80px)",
            color: "rgba(255,255,255,0.05)",
          }}
        >
          0{index + 1}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────
export default function ZigzagSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  useRiseOnScroll(headerRef);

  return (
    <section
      style={{
        background: "#000",
        paddingTop: "clamp(80px, 10vw, 140px)",
      }}
    >
      {/* HEADER */}
      <div
        ref={headerRef}
        style={{
          textAlign: "center",
          padding: "0 20px 80px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "16px",
          }}
        >
          Transformers
        </p>

        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 64px)",
            lineHeight: 1.1,
            color: "#fff",
          }}
        >
          Between Earth and steel,<br />
          legends rise.
        </h2>
      </div>

      {/* ITEMS */}
      {ITEMS.map((item, i) => (
        <ZigzagItem key={i} item={item} index={i} />
      ))}
    </section>
  );
}
