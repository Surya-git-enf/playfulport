// components/FleetRoster.tsx
"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const roster = [
  { name: "The Yellow Scout", image: "/roster/scout.jpg", align: "left" },
  { name: "The Iron Bruiser", image: "/roster/bruiser.jpg", align: "right" },
  { name: "The Silver Illusionist", image: "/roster/illusionist.jpg", align: "left" },
];

export default function FleetRoster() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = gsap.utils.toArray('.roster-row');
    rows.forEach((row: any) => {
      gsap.fromTo(row, 
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%" }
        }
      );
    });
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-white text-gray-900 py-32 z-40 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-24">
        {roster.map((item, index) => (
          <div key={index} className="flex flex-col gap-16">
            <div className={`roster-row flex flex-col ${item.align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
              {/* Image Container */}
              <div className="w-full md:w-1/2 aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                  Image Placeholder
                </div>
              </div>
              
              {/* Text Container */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-gray-900 mb-4">
                  {item.name}
                </h2>
              </div>
            </div>
            
            {/* Elegant Divider */}
            {index !== roster.length - 1 && (
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            )}
          </div>
        ))}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-8" />
      </div>
    </section>
  );
}

