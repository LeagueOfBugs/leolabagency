/**
 * ContactBlock.tsx
 * Two-column contact section: info left, map right.
 * Map embed is optional — omit mapEmbedUrl to show info only.
 *
 * Usage:
 *   <ContactBlock
 *     businessName="Iliana's Tailoring"
 *     address={{ street: "123 Main St", city: "Binghamton", state: "NY", zip: "13901" }}
 *     phone="(607) 555-1234"
 *     hours={[
 *       { days: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
 *       { days: "Saturday", hours: "10:00 AM – 4:00 PM" },
 *       { days: "Sunday", hours: "Closed" },
 *     ]}
 *     mapEmbedUrl="https://www.google.com/maps/embed?pb=..."
 *   />
 */

import React from "react";
import type { ContactBlockProps } from "../types";

export function ContactBlock({
  businessName,
  address,
  phone,
  email,
  hours,
  mapEmbedUrl,
  parkingNote,
  note,
}: ContactBlockProps) {
  const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;

  return (
    <section className="py-16 px-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#2C2C2C] mb-10">Find Us</h2>

        <div className={`grid gap-10 ${mapEmbedUrl ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-lg"}`}>
          {/* Info column */}
          <div className="space-y-8">
            {/* Address */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8C7B6B] mb-3">
                Address
              </h3>
              <address className="not-italic text-[#2C2C2C] leading-relaxed">
                <p className="font-semibold">{businessName}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
              </address>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-[#C0392B] hover:underline font-medium"
              >
                Get directions →
              </a>
              {parkingNote && (
                <p className="mt-1 text-xs text-[#8C7B6B]">{parkingNote}</p>
              )}
            </div>

            {/* Phone & Email */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8C7B6B] mb-3">
                Contact
              </h3>
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="block text-[#2C2C2C] hover:text-[#C0392B] font-medium transition-colors"
              >
                {phone}
              </a>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block text-[#2C2C2C] hover:text-[#C0392B] transition-colors text-sm mt-1"
                >
                  {email}
                </a>
              )}
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8C7B6B] mb-3">
                Hours
              </h3>
              {note && (
                <p className="text-sm text-[#C0392B] font-medium mb-2">{note}</p>
              )}
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {hours.map(({ days, hours: h }) => (
                    <tr key={days}>
                      <td className="py-2 pr-4 text-[#8C7B6B]">{days}</td>
                      <td
                        className={`py-2 font-medium ${
                          h.toLowerCase() === "closed"
                            ? "text-[#8C7B6B]"
                            : "text-[#2C2C2C]"
                        }`}
                      >
                        {h}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map column */}
          {mapEmbedUrl && (
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 min-h-[320px] lg:min-h-0">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing location of ${businessName}`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
