"use client";

/**
 * BookingWidget.tsx
 * Drop-in component — handles the form → success state transition.
 * This is the only component most pages need to import.
 *
 * Usage:
 *   import { BookingWidget } from '@/modules/booking/components/BookingWidget';
 *
 *   <BookingWidget
 *     config={{
 *       businessName: "Iliana's Tailoring",
 *       services: [
 *         "Hemming (pants / skirts / dresses)",
 *         "Taking In / Letting Out",
 *         "Zipper Repair or Replacement",
 *         "Sleeve Adjustment",
 *         "Patch or Repair",
 *         "Formal / Bridal",
 *         "Not sure — I'll describe in notes",
 *       ],
 *       disabledDays: [0], // disable Sundays
 *     }}
 *   />
 */

import React, { useState } from "react";
import { BookingForm } from "./BookingForm";
import { BookingSuccess } from "./BookingSuccess";
import type { BookingConfig } from "../types";

interface BookingWidgetProps {
  config: BookingConfig;
  /** Optional class applied to the outer wrapper */
  className?: string;
}

type WidgetState =
  | { stage: "form" }
  | { stage: "success"; appointmentId: string; customerName: string };

export function BookingWidget({ config, className }: BookingWidgetProps) {
  const [state, setState] = useState<WidgetState>({ stage: "form" });

  if (state.stage === "success") {
    return (
      <div className={className}>
        <BookingSuccess
          name={state.customerName}
          businessName={config.businessName}
          appointmentId={state.appointmentId}
          onBookAnother={() => setState({ stage: "form" })}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <BookingForm
        config={config}
        onSuccess={(appointmentId) => {
          // Pull the name from the last form submission via a small trick:
          // The form calls onSuccess with the ID; we read the name from the
          // DOM input so we don't need to thread it through the callback.
          const nameInput = document.getElementById(
            "booking-name"
          ) as HTMLInputElement | null;
          const customerName = nameInput?.value ?? "";
          setState({ stage: "success", appointmentId, customerName });
        }}
      />
    </div>
  );
}
