
"use client";

import { useEffect, useRef } from "react";

const ITEMS = [
  {
    src: "/transformers/bumble.jpg",
    tag: "Scout",
    title: "Bumblebee\nThe spark of speed.",
    description:
      "A fearless Autobot scout with fast moves, bright energy, and a loyal heart. He brings motion, emotion, and the first pulse of the battle.",
  },
  {
    src: "/transformers/Optimus.jpg",
    tag: "Leader",
    title: "Optimus Prime\nBorn to lead.",
    description:
      "The noble commander of the Autobots. Strong, calm, and heroic, he stands as the symbol of honor, sacrifice, and hope.",
  },
  {
    src: "/transformers/megatron.jpg",
    tag: "Threat",
    title: "Megatron\nPower without mercy.",
    description:
      "The dark force behind the war. Sharp, brutal, and unstoppable, he brings heavy tension and the final shadow over the story.",
  },
];

function useRiseOnScroll(ref: React.RefObject<HTMLDivElement | null>) {
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
        justifyContent: "space-between",
        gap: "clamp(28px, 6vw, 96px)",
        padding: "clamp(42px, 7vw, 92px) clamp(20px, 8vw, 120px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08), 0 18px 40px rgba(255,255,255,0.06) inset",
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: "clamp(260px, 42vw, 560px)",
          aspectRatio: "4 / 3",
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",
          background: "#0b0b0b",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.10), 0 18px 60px rgba(0,0,0,0.65)",
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
            transition: "transform 0.6s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.28) 0%, transparent 58%, rgba(0,0,0,0.18) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 14px 0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.42)",
            fontWeight: 600,
          }}
        >
          {item.tag}
        </p>

        <h3
          style={{
            margin: "0 0 18px 0",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(28px, 3.6vw, 56px)",
            fontWeight: 400,
            lineHeight: 1.08,
            color: "#fff",
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {item.title}
        </h3>

        <div
          style={{
            width: "56px",
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
            marginBottom: "18px",
            boxShadow: "0 0 22px rgba(255,255,255,0.65)",
          }}
        />

        <p
          style={{
            margin: 0,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "clamp(14px, 1.3vw, 17px)",
            lineHeight: 1.85,
            color: "rgba(255,255,255,0.58)",
            fontWeight: 300,
            letterSpacing: "0.01em",
            maxWidth: "520px",
          }}
        >
          {item.description}
        </p>

        <div
          style={{
            marginTop: "28px",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(44px, 6vw, 84px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.05)",
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
        borderTop: "1px solid rgba(255,255,255,0.10)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <div
        ref={headerRef}
        style={{
          textAlign: "center",
          padding: "0 clamp(24px, 8vw, 120px) clamp(40px, 6vw, 80px)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 18px 60px rgba(255,255,255,0.05) inset",
        }}
      >
        <p
          style={{
            margin: "0 0 16px 0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.34)",
            fontWeight: 600,
          }}
        >
          Transformers
        </p>

        <h2
          style={{
            margin: 0,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(30px, 4.2vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.08,
            color: "#fff",
            letterSpacing: "-0.025em",
          }}
        >
          Bumblebee, Optimus Prime,
          <br />
          and Megatron.
        </h2>

        <p
          style={{
            margin: "22px auto 0",
            maxWidth: "760px",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "clamp(14px, 1.3vw, 17px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.45)",
            fontWeight: 300,
          }}
        >
          Three icons. One war. Fast light, heroic strength, and dark power —
          framed like a cinematic poster sequence.
        </p>
      </div>

      {ITEMS.map((item, i) => (
        <ZigzagItem key={i} item={item} index={i} />
      ))}
    </section>
  );
}
