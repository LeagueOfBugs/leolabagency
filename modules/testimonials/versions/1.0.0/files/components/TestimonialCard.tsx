import React from "react";
import type { Testimonial } from "../types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: "light" | "dark";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-[#C0392B]" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial, variant = "light" }: TestimonialCardProps) {
  const { name, location, quote, rating = 5, avatarUrl } = testimonial;
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-xl p-6 flex flex-col gap-4 ${
        isDark ? "bg-white/10" : "bg-white shadow-sm border border-gray-100"
      }`}
    >
      <StarRating rating={rating} />

      <blockquote
        className={`text-sm leading-relaxed flex-1 ${
          isDark ? "text-white/90" : "text-[#2C2C2C]"
        }`}
      >
        "{quote}"
      </blockquote>

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100/20">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              isDark ? "bg-white/20 text-white" : "bg-[#FAF7F2] text-[#2C2C2C]"
            }`}
            aria-hidden="true"
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#2C2C2C]"}`}>
            {name}
          </p>
          {location && (
            <p className={`text-xs ${isDark ? "text-white/60" : "text-[#8C7B6B]"}`}>
              {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
