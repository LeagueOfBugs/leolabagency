/**
 * PricingSection.tsx
 * Full pricing page section with heading, grouped table, and footer notes.
 *
 * Usage:
 *   <PricingSection
 *     heading="Services & Pricing"
 *     subheading="Straightforward pricing. No surprises."
 *     groups={[
 *       {
 *         title: "Pants & Bottoms",
 *         items: [
 *           { service: "Hem pants", notes: "cuff or plain", from: "$10" },
 *           { service: "Taper pants", from: "$18" },
 *         ],
 *       },
 *     ]}
 *     notes={["Prices are starting rates. Final price depends on fabric and complexity."]}
 *   />
 */

import React from "react";
import { PricingTable } from "./PricingTable";
import type { PricingSectionProps } from "../types";

export function PricingSection({
  groups,
  heading = "Services & Pricing",
  subheading,
  notes = [],
}: PricingSectionProps) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">{heading}</h2>
          {subheading && (
            <p className="text-[#8C7B6B]">{subheading}</p>
          )}
        </div>

        <PricingTable groups={groups} />

        {/* Footer notes */}
        {notes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1">
            {notes.map((note, i) => (
              <p key={i} className="text-xs text-[#8C7B6B] leading-relaxed">
                * {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
