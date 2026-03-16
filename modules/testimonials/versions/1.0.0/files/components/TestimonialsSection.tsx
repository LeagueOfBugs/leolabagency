/**
 * TestimonialsSection.tsx
 * Drop-in testimonials section. Pass an array of testimonial objects.
 *
 * Usage:
 *   <TestimonialsSection
 *     heading="What Binghamton is Saying"
 *     testimonials={[
 *       { name: "Maria C.", location: "Binghamton, NY", quote: "Saved my wedding dress!", rating: 5 },
 *     ]}
 *   />
 */

import React from "react";
import { TestimonialCard } from "./TestimonialCard";
import type { TestimonialsSectionProps } from "../types";

export function TestimonialsSection({
  testimonials,
  heading = "What Our Customers Say",
  subheading,
  variant = "light",
}: TestimonialsSectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`py-16 px-6 ${isDark ? "bg-[#2C2C2C]" : "bg-[#FAF7F2]"}`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className={`text-3xl font-bold mb-3 ${
              isDark ? "text-[#FAF7F2]" : "text-[#2C2C2C]"
            }`}
          >
            {heading}
          </h2>
          {subheading && (
            <p className={`text-base ${isDark ? "text-[#FAF7F2]/70" : "text-[#8C7B6B]"}`}>
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
}
