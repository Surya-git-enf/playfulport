"use client";

import { useEffect, useRef, type RefObject } from "react";

type ZigzagItemData = {
  src: string;
  tag: string;
  title: string;
  description: string;
  ratio: string;
};

const ITEMS: ZigzagItemData[] = [
  {
    src: "/transformers/bumble.jpg",
    tag: "Autobot",
    title: "Bumblebee\nmoves with instinct.",
    description:
      "Fast, fearless, and full of spark — Bumblebee brings energy to every frame with a clean, cinematic presence that feels alive on scroll.",
    ratio: "19 / 6",
  },
  {
    src: "/transformers/megatron.jpg",
    tag: "Decepticon",
    title: "Megatron\ncommands the screen.",
    description:
      "Dark, powerful, and precise — Megatron sets the tone with heavy visual impact and bold futuristic dominance.",
    ratio: "6 / 19",
  },
  {
    src: "/transformers/optimus.jpg",
    tag: "Autobot Leader",
    title: "Optimus Prime\nleads with purpose.",
    description:
      "Strong, balanced, and iconic — Optimus Prime anchors the experience with leadership, depth, and a heroic cinematic presence.",
    ratio: "19 / 6",
  },
  {
    src: "/sequence/ezgif-frame-270.jpg",
    tag: "Alliance",
    title: "More than meets\nthe eye.",
    description:
      "An evolving digital experience — where motion, depth, and storytelling transform every scroll into something unforgettable.",
    ratio: "6 / 19",
  },
];

function useRiseOnScroll(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(52px)";
    el.style.transition =
      "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)";

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
  item: ZigzagItemData;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  useRiseOnScroll(rowRef);

  const isEven = index % 2 === 0;

  // 🔥 Glow color logic
  const glowColor =
    item.tag.toLowerCase().includes("decepticon")
      ? "rgba(255, 60, 60, 0.9)" // red
      : "rgba(80, 180, 255, 0.9)"; // blue

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
    >
      {/* IMAGE */}
      <div
        style={{
          flex: "0 0 auto",
          width: "clamp(280px, 46vw, 620px)",
          aspectRatio: item.ratio,
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",

          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.06), #0a0a0a 70%)",

          boxShadow: `
            0 0 12px ${glowColor},
            0 0 32px ${glowColor},
            0 0 60px ${glowColor}55,
            inset 0 0 20px rgba(255,255,255,0.05)
          `,

          border: `1px solid ${glowColor}`,
          transition: "all 0.4s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `
            0 0 20px ${glowColor},
            0 0 60px ${glowColor},
            0 0 120px ${glowColor},
            inset 0 0 25px rgba(255,255,255,0.08)
          `;
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `
            0 0 12px ${glowColor},
            0 0 32px ${glowColor},
            0 0 60px ${glowColor}55,
            inset 0 0 20px rgba(255,255,255,0.05)
          `;
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
          }}
        >
          <img
            src={item.src}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // ✅ NO CROPPING
              objectPosition: "center",
            }}
          />
        </div>
      </div>

      {/* TEXT */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            marginBottom: "16px",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {item.tag}
        </p>

        <h3
          style={{
            marginBottom: "20px",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "clamp(26px, 3.2vw, 48px)",
            lineHeight: 1.1,
            whiteSpace: "pre-line",
            textTransform: "uppercase",
          }}
        >
          {item.title}
        </h3>

        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(255,255,255,0.3)",
            marginBottom: "20px",
          }}
        />

        <p
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(15px, 1.3vw, 17px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.65)",
            maxWidth: "480px",
          }}
        >
          {item.description}
        </p>

        <div
          style={{
            marginTop: "30px",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "clamp(48px, 6vw, 80px)",
            color: "rgba(255,255,255,0.05)",
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
    <section style={{ background: "#000", paddingTop: "100px" }}>
      {/* HEADER */}
      <div ref={headerRef} style={{ textAlign: "center", marginBottom: "80px" }}>
        <p
          style={{
            fontFamily: "Orbitron",
            letterSpacing: "0.3em",
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Transformers Mode
        </p>

        <h2
          style={{
            fontFamily: "Orbitron",
            fontSize: "clamp(30px,4vw,56px)",
            textTransform: "uppercase",
          }}
        >
          More than meets the eye
        </h2>
      </div>

      {ITEMS.map((item, i) => (
        <ZigzagItem key={i} item={item} index={i} />
      ))}
    </section>
  );
          }
