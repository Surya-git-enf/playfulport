"use client";

import { useEffect } from "react";
import HeroCanvas from "@/components/HeroCanvas";
import FooterCanvas from "@/components/FooterCanvas";
import ZigzagSection from "@/components/ZigzagSection";

export default function Home() {
  useEffect(() => {
    // Force scroll to top on mount so GSAP pins calculate correctly
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff" }}>

      {/* ── 1. HERO — pinned scroll animation ─────────── */}
      <HeroCanvas />

      {/* ── 2. ZIGZAG — THIS MUST SHOW AFTER HERO ──────
          If you can't see this, your HeroCanvas pinSpacing
          is broken. The red debug border below will confirm
          the section IS in the DOM. Remove border after fix.
      ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          background: "#000",
        }}
      >
        <ZigzagSection />
      </div>

      {/* ── 3. FOOTER — pinned reverse animation ───────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          background: "#000",
        }}
      >
        <FooterCanvas />
      </div>

      {/* ── 4. END CREDITS ──────────────────────────────── */}
      <div
        style={{
          background: "#000",
          padding: "60px 40px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
            margin: 0,
          }}
        >
          Playful &nbsp;·&nbsp; 3D Website Design Agency &nbsp;·&nbsp; 2024
        </p>
      </div>
    </div>
  );
}

