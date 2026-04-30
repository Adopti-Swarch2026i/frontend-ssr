"use client";

import React from "react";
import Link from "next/link";

export interface SliderItem {
  imageUrl: string;
  petId: string;
  name: string;
}

interface ImageAutoSliderProps {
  items: SliderItem[];
  speed?: number;
}

export function ImageAutoSlider({ items, speed = 20 }: ImageAutoSliderProps) {
  if (items.length === 0) return null;

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right ${speed}s linear infinite;
        }

        .infinite-scroll:hover {
          animation-play-state: paused;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>

      <div className="scroll-container w-full overflow-hidden">
        <div className="infinite-scroll flex gap-4 w-max">
          {duplicatedItems.map((item, index) => {
            const imgContent = (
              <img
                src={item.imageUrl}
                alt={`Foto de ${item.name}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-pet.svg";
                }}
              />
            );
            const className =
              "image-item flex-shrink-0 w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer";

            return item.petId ? (
              <Link
                key={index} href={`/pets/${item.petId}`}
                className={className}
                aria-label={`Ver reporte de ${item.name}`}
              >
                {imgContent}
              </Link>
            ) : (
              <div key={index} className={className}>
                {imgContent}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
