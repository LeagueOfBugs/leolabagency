"use client";

/**
 * GalleryItem.tsx
 * Single gallery card. If beforeSrc is provided, clicking toggles between
 * before and after images.
 */

import React, { useState } from "react";
import type { GalleryItemData } from "../types";

interface GalleryItemProps {
  item: GalleryItemData;
}

export function GalleryItem({ item }: GalleryItemProps) {
  const { src, beforeSrc, alt, caption, service } = item;
  const hasBeforeAfter = !!beforeSrc;
  const [showBefore, setShowBefore] = useState(false);

  const activeSrc = hasBeforeAfter && showBefore ? beforeSrc! : src;
  const activeLabel = hasBeforeAfter ? (showBefore ? "Before" : "After") : null;

  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={activeSrc}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Before/After badge */}
        {activeLabel && (
          <span className="absolute top-3 left-3 text-xs font-semibold bg-black/60 text-white px-2.5 py-1 rounded-full">
            {activeLabel}
          </span>
        )}

        {/* Toggle button */}
        {hasBeforeAfter && (
          <button
            onClick={() => setShowBefore((v) => !v)}
            className="absolute bottom-3 right-3 text-xs font-semibold bg-white/90 hover:bg-white text-[#2C2C2C] px-3 py-1.5 rounded-full shadow transition-colors"
            aria-label={showBefore ? "Show after" : "Show before"}
          >
            {showBefore ? "See After →" : "← See Before"}
          </button>
        )}
      </div>

      {/* Caption */}
      {(caption || service) && (
        <div className="px-4 py-3">
          {service && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#C0392B] mb-0.5">
              {service}
            </p>
          )}
          {caption && (
            <p className="text-sm text-[#2C2C2C]">{caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
