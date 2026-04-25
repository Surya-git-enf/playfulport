import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playful — 3D Website Design Agency",
  description: "Playful is a 3D website designing agency.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#000",
          color: "#fff",
          // CRITICAL: overflowX hidden on body breaks GSAP ScrollTrigger pinning.
          // Do NOT set overflow:hidden here. Let GSAP manage scroll.
          overflowX: "clip",
        }}
      >
        {children}
      </body>
    </html>
  );
}

