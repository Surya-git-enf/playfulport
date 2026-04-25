
import type { Metadata } from "next";
import HeroCanvas from "@/components/HeroCanvas";
import FooterCanvas from "@/components/FooterCanvas";

export const metadata: Metadata = {
  title: "Optimus Prime",
  description: "A symbol of strength, honor, and hope. Born to protect. Built to lead.",
};

export default function Home() {
  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      {/* ── HERO: frames 0 → 269 ───────────────────── */}
      <HeroCanvas />

      {/* ── INTERSTITIAL CONTENT ─────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px",
          gap: "60px",
        }}
      >
        {/* Top rule */}
        <div
          style={{
            width: "1px",
            height: "80px",
            background: "rgba(255,255,255,0.2)",
          }}
        />

        <div
          style={{
            maxWidth: "680px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 20px 0",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(11px, 1vw, 13px)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Optimus Prime<br />   Born to lead.
          </p>
          <h2
            style={{
              margin: "0 0 28px 0",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(30px, 4vw, 56px)",
              fontWeight: 300,
              lineHeight: 1.15,
              color: "#fff",
              letterSpacing: "-0.015em",
            }}
          >
            The Rise of Optimus Prime
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(14px, 1.3vw, 17px)",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.4)",
              fontWeight: 300,
              letterSpacing: "0.01em",
            }}
          >
            Steel, courage, and destiny — one leader against the dark.
          </p>
        </div>

        {/* Stat row */}
        <div
          style={{
            display: "flex",
            gap: "80px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { number: "270", label: "Frames" },
            { number: "60", label: "FPS Target" },
            { number: "1×", label: "No Stutter" },
          ].map(({ number, label }) => (
            <div
              key={label}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 300,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {number}
              </div>
              <div
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div
          style={{
            width: "1px",
            height: "80px",
            background: "rgba(255,255,255,0.2)",
          }}
        />
      </section>

      {/* ── FOOTER: frames 269 → 0 ───────────────── */}
      <FooterCanvas />

      {/* ── END CREDITS ──────────────────────────── */}
      <section
        style={{
          background: "#000",
          padding: "80px 40px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            margin: 0,
          }}
        >
          Cinematic Scroll &nbsp;·&nbsp; GSAP ScrollTrigger &nbsp;·&nbsp; Canvas API
        </p>
      </section>
    </main>
  );
}
