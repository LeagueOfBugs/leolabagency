/**
 * Hero.tsx
 * Full-width hero section. Works standalone — no other modules required.
 *
 * Usage:
 *   <Hero
 *     headline="Alterations & Repairs Done Right."
 *     subheadline="Fast, affordable tailoring in Binghamton, NY. Ready in 3–5 days."
 *     primaryCta={{ label: "Book an Appointment", href: "/book" }}
 *     secondaryCta={{ label: "See Our Services", href: "/services" }}
 *     badges={["Fast Turnaround — 3 to 5 days", "Local to Binghamton, NY", "Alterations from $10"]}
 *   />
 */

import React from "react";
import type { HeroProps } from "../types";

export function Hero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  badges = [],
  variant = "dark",
  backgroundImage,
  minHeight = "80vh",
}: HeroProps) {
  const isDark = variant === "dark";

  return (
    <section
      className="relative flex items-center justify-center px-6 py-20"
      style={{ minHeight }}
    >
      {/* Background */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        </>
      ) : (
        <div
          className={`absolute inset-0 ${isDark ? "bg-[#2C2C2C]" : "bg-[#FAF7F2]"}`}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1
          className={`font-bold tracking-tight mb-4 ${
            isDark || backgroundImage
              ? "text-[#FAF7F2]"
              : "text-[#2C2C2C]"
          } text-4xl sm:text-5xl lg:text-6xl leading-tight`}
        >
          {headline}
        </h1>

        {subheadline && (
          <p
            className={`text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed ${
              isDark || backgroundImage ? "text-[#FAF7F2]/80" : "text-[#8C7B6B]"
            }`}
          >
            {subheadline}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-[#C0392B] hover:bg-[#96281B] text-white font-semibold transition-colors text-base"
              >
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={`inline-flex items-center justify-center px-7 py-3.5 rounded-lg border font-semibold transition-colors text-base ${
                  isDark || backgroundImage
                    ? "border-[#FAF7F2]/50 text-[#FAF7F2] hover:bg-[#FAF7F2]/10"
                    : "border-[#2C2C2C]/30 text-[#2C2C2C] hover:bg-[#2C2C2C]/5"
                }`}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}

        {/* Trust badges */}
        {badges.length > 0 && (
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className={`text-sm px-4 py-1.5 rounded-full border ${
                  isDark || backgroundImage
                    ? "border-[#FAF7F2]/20 text-[#FAF7F2]/70"
                    : "border-[#2C2C2C]/15 text-[#8C7B6B]"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
