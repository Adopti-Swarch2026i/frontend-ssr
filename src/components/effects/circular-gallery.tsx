"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CircularGalleryProps {
  images: { src: string; alt: string }[];
  autoplay?: boolean;
}

function calculateGap(width: number) {
  const minWidth = 400;
  const maxWidth = 800;
  const minGap = 40;
  const maxGap = 70;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export function CircularGallery({ images, autoplay = false }: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = images.length;

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay && total > 1) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % total);
      }, 4000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, [total]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + total) % total === index;
    const isRight = (activeIndex + 1) % total === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Sin fotos</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
      {/* Image carousel */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square"
        style={{ perspective: "1000px" }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className="absolute w-full h-full object-cover rounded-2xl"
            style={{
              ...getImageStyle(index),
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          onMouseEnter={() => setHoverPrev(true)}
          onMouseLeave={() => setHoverPrev(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: hoverPrev
              ? "hsl(var(--primary))"
              : "hsl(var(--muted))",
          }}
          aria-label="Foto anterior"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: hoverPrev ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }} />
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                if (autoplayRef.current) clearInterval(autoplayRef.current);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex
                  ? "bg-primary w-4"
                  : "bg-muted-foreground/30"
              }`}
              aria-label={`Ir a foto ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          onMouseEnter={() => setHoverNext(true)}
          onMouseLeave={() => setHoverNext(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: hoverNext
              ? "hsl(var(--primary))"
              : "hsl(var(--muted))",
          }}
          aria-label="Foto siguiente"
        >
          <ArrowRight className="h-5 w-5" style={{ color: hoverNext ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }} />
        </button>
      </div>
    </div>
  );
}
