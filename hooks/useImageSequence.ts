
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
    let isMounted = true; // prevents state updates after unmount
    let loadedCount = 0;

    const imgArray: HTMLImageElement[] = new Array(frameCount);

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();

      // 3-digit padding → matches ezgif-frame-001.jpg
      const paddedIndex = (i + 1).toString().padStart(3, "0");

      img.src = `${pathPrefix}${paddedIndex}${extension}`;

      img.onload = () => {
        loadedCount++;

        if (!isMounted) return;

        setLoadedProgress(Math.round((loadedCount / frameCount) * 100));

        if (loadedCount === frameCount) {
          setImages(imgArray);
          setIsReady(true);
        }
      };

      img.onerror = () => {
        console.warn(`❌ Failed to load: ${img.src}`);
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
