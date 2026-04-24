import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// components/HeroCanvas.tsx
"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { drawImageProp } from '@/utils/canvas';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  images: HTMLImageElement[];
}

export default function HeroCanvas({ images }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images.length || !canvasRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateDimensions = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
      drawImageProp(ctx, images[0], canvas);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.5,
      }
    });

    const obj = { frame: 0 };
    timeline.to(obj, {
      frame: images.length - 1,
      snap: "frame",
      ease: "none",
      duration: 1,
      onUpdate: () => {
        requestAnimationFrame(() => {
          drawImageProp(ctx, images[Math.round(obj.frame)], canvas);
        });
      }
    });

    // Rising White Gradient
    timeline.to(overlayRef.current, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, ">-0.1");
    timeline.fromTo(textPanelRef.current, 
      { x: 50, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.2, ease: "power3.out" }, 
      "<"
    );

    return () => {
      window.removeEventListener('resize', updateDimensions);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [images]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-gray-50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Soft Bottom Vignette */}
      <div className="absolute bottom-0 w-full h-[10%] bg-gradient-to-t from-white/80 to-transparent z-10" />

      {/* Rising White Gradient Overlay */}
      <div 
        ref={overlayRef} 
        className="absolute bottom-0 w-full h-2/5 bg-gradient-to-t from-white via-white/90 to-transparent z-20 translate-y-full opacity-0"
      />

      {/* Elegant Light Glassmorphism Panel */}
      <div className="absolute inset-0 flex items-center justify-end px-12 md:px-24 z-30 pointer-events-none">
        <div 
          ref={textPanelRef}
          className="max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] opacity-0"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-wider uppercase mb-4">
            The Prime Sentinel
          </h1>
          <p className="text-lg text-gray-700 font-medium leading-relaxed">
            Heavy artillery. Unbreakable will. The commander of the fleet has arrived.
          </p>
        </div>
      </div>
    </section>
  );
      }

