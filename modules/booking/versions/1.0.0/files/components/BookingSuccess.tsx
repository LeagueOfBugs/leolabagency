"use client";

/**
 * BookingSuccess.tsx
 * Shown after a successful booking submission.
 */

import React from "react";

interface BookingSuccessProps {
  name: string;
  businessName: string;
  appointmentId: string;
  onBookAnother: () => void;
}

export function BookingSuccess({
  name,
  businessName,
  appointmentId,
  onBookAnother,
}: BookingSuccessProps) {
  const ref = `#${appointmentId.slice(0, 8).toUpperCase()}`;

  return (
    <div className="text-center py-8 px-4">
      {/* Checkmark */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You're all set, {name}!
      </h2>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Your appointment request has been sent to{" "}
        <strong>{businessName}</strong>. We'll reach out within 24 hours to
        confirm your time.
      </p>

      <p className="text-xs text-gray-400 mb-8">Reference: {ref}</p>

      <button
        onClick={onBookAnother}
        className="text-sm text-[#C0392B] hover:underline font-medium"
      >
        Book another appointment
      </button>
    </div>
  );
}
