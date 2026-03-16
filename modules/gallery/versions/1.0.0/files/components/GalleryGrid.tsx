/**
 * GalleryGrid.tsx
 * Responsive image gallery. Each item optionally supports before/after toggle.
 *
 * Usage:
 *   <GalleryGrid
 *     heading="Our Work"
 *     subheading="Every garment gets the same care."
 *     items={[
 *       {
 *         src: "/images/after-hem.jpg",
 *         beforeSrc: "/images/before-hem.jpg",
 *         alt: "Pants after hemming",
 *         service: "Hemming",
 *         caption: "Pants hemmed and tapered",
 *       },
 *     ]}
 *   />
 */

import React from "react";
import { GalleryItem } from "./GalleryItem";
import type { GalleryGridProps } from "../types";

const COLUMN_CLASSES: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function GalleryGrid({
  items,
  heading,
  subheading,
  columns = 3,
}: GalleryGridProps) {
  const colClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-10">
            {heading && (
              <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">{heading}</h2>
            )}
            {subheading && (
              <p className="text-[#8C7B6B]">{subheading}</p>
            )}
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center text-[#8C7B6B]">
            <p className="font-medium">Photos coming soon</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${colClass} gap-5`}>
            {items.map((item, i) => (
              <GalleryItem key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
