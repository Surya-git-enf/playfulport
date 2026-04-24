
"use client";
import { useState, useEffect } from "react";

export function useImageSequence(
  frameCount: number,
  pathPrefix: string,
  extension: string = ".jpg"
) {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedProgress, setLoadedProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    const imgArray: HTMLImageElement[] = new Array(frameCount);

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();

      const paddedIndex = (i + 1).toString().padStart(3, "0");
      const src = `${pathPrefix}${paddedIndex}${extension}`;

      img.src = src;

      img.onload = () => {
        loadedCount++;

        if (!isMounted) return;

        setLoadedProgress(Math.round((loadedCount / frameCount) * 100));

        if (loadedCount === frameCount) {
          console.log("✅ All frames loaded");
          setImages(imgArray);
          setIsReady(true);
        }
      };

      img.onerror = () => {
        console.error("❌ Missing frame:", src);

        loadedCount++;

        if (!isMounted) return;

        if (loadedCount === frameCount) {
          setImages(imgArray);
          setIsReady(true);
        }
      };

      imgArray[i] = img;
    }

    return () => {
      isMounted = false;
    };
  }, [frameCount, pathPrefix, extension]);

  return { images, loadedProgress, isReady };
}
