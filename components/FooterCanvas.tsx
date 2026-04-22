// components/FooterCanvas.tsx
"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { drawImageProp } from '@/utils/canvas';

interface Props {
  images: HTMLImageElement[];
}

export default function FooterCanvas({ images }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images.length || !canvasRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateDimensions = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
      drawImageProp(ctx, images[images.length - 1], canvas); // Draw last frame initially
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
      }
    });

    // Reverse Sequence (last frame -> 0)
    const obj = { frame: images.length - 1 };
    timeline.to(obj, {
      frame: 0,
      snap: "frame",
      ease: "none",
      duration: 1,
      onUpdate: () => {
        requestAnimationFrame(() => {
          drawImageProp(ctx, images[Math.round(obj.frame)], canvas);
        });
      }
    });

    // Rising White Gradient & CTA
    timeline.to(overlayRef.current, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, ">-0.1");
    timeline.fromTo(ctaRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.2, ease: "power3.out" }, 
      "<"
    );

    return () => {
      window.removeEventListener('resize', updateDimensions);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [images]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Soft Bottom Vignette */}
      <div className="absolute bottom-0 w-full h-[10%] bg-gradient-to-t from-white/80 to-transparent z-10" />

      {/* Rising White Gradient Overlay */}
      <div 
        ref={overlayRef} 
        className="absolute bottom-0 w-full h-3/5 bg-gradient-to-t from-white via-white/95 to-transparent z-20 translate-y-full opacity-0"
      />

      {/* Elegant CTA UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
        <div ref={ctaRef} className="flex flex-col items-center gap-6 opacity-0 pointer-events-auto mt-32">
          
          {/* Logo */}
          <div className="w-16 h-16 bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
            <span className="text-white font-bold text-xs tracking-widest">LOGO</span>
          </div>
          
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-3 tracking-tight">Playful</h2>
            <p className="text-xl text-gray-600 font-medium">3D website builder.</p>
          </div>
          
          <button className="px-10 py-4 mt-6 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}

