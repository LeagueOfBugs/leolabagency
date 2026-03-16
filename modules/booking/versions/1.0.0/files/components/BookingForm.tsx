"use client";

/**
 * BookingForm.tsx
 * Appointment request form. Submits to /api/booking/appointments.
 * All configuration (services, time slots, disabled days) is passed via props.
 *
 * Usage:
 *   <BookingForm
 *     config={{ businessName: "Iliana's Tailoring", services: ["Hemming", "Zipper Repair"] }}
 *     onSuccess={(id) => console.log("booked", id)}
 *   />
 */

import React, { useState } from "react";
import type { BookingConfig, BookingFormData, CreateAppointmentResponse } from "../types";
import { DEFAULT_TIME_SLOTS } from "../types";

interface BookingFormProps {
  config: BookingConfig;
  onSuccess: (appointmentId: string) => void;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  service?: string;
  preferred_date?: string;
  preferred_time?: string;
}

function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getMinDate(disabledDays: number[]): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  // Advance past any leading disabled days
  while (disabledDays.includes(d.getDay())) {
    d.setDate(d.getDate() + 1);
  }
  return d.toISOString().split("T")[0];
}

export function BookingForm({ config, onSuccess }: BookingFormProps) {
  const {
    services,
    disabledDays = [0],
    timeSlots = DEFAULT_TIME_SLOTS,
  } = config;

  const [form, setForm] = useState<BookingFormData>({
    name: "",
    phone: "",
    email: "",
    service: "",
    preferred_date: "",
    preferred_time: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof BookingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.service) next.service = "Please select a service";
    if (!form.preferred_date) next.preferred_date = "Please choose a date";
    if (!form.preferred_time) next.preferred_time = "Please choose a time";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/booking/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Error ${res.status}`);
      }

      const data = (await res.json()) as CreateAppointmentResponse;
      onSuccess(data.appointmentId);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = getMinDate(disabledDays);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-1">
          Full name <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="booking-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          className={inputClass(!!errors.name)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "booking-name-err" : undefined}
        />
        {errors.name && <p id="booking-name-err" className={errClass}>{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone number <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="booking-phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={set("phone")}
          className={inputClass(!!errors.phone)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "booking-phone-err" : undefined}
        />
        {errors.phone && <p id="booking-phone-err" className={errClass}>{errors.phone}</p>}
      </div>

      {/* Email (optional) */}
      <div>
        <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-gray-400 font-normal">(optional — for confirmation)</span>
        </label>
        <input
          id="booking-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          className={inputClass(false)}
        />
      </div>

      {/* Service */}
      <div>
        <label htmlFor="booking-service" className="block text-sm font-medium text-gray-700 mb-1">
          Service needed <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <select
          id="booking-service"
          value={form.service}
          onChange={set("service")}
          className={inputClass(!!errors.service)}
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? "booking-service-err" : undefined}
        >
          <option value="">Select a service…</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.service && <p id="booking-service-err" className={errClass}>{errors.service}</p>}
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred date <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="booking-date"
            type="date"
            min={minDate}
            value={form.preferred_date}
            onChange={set("preferred_date")}
            className={inputClass(!!errors.preferred_date)}
            aria-invalid={!!errors.preferred_date}
            aria-describedby={errors.preferred_date ? "booking-date-err" : undefined}
          />
          {errors.preferred_date && (
            <p id="booking-date-err" className={errClass}>{errors.preferred_date}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-time" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred time <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <select
            id="booking-time"
            value={form.preferred_time}
            onChange={set("preferred_time")}
            className={inputClass(!!errors.preferred_time)}
            aria-invalid={!!errors.preferred_time}
            aria-describedby={errors.preferred_time ? "booking-time-err" : undefined}
          >
            <option value="">Select a time…</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>{slot.label}</option>
            ))}
          </select>
          {errors.preferred_time && (
            <p id="booking-time-err" className={errClass}>{errors.preferred_time}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="booking-notes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          value={form.notes}
          onChange={set("notes")}
          placeholder="Describe what needs altering, fabric type, any urgency…"
          className={`${inputClass(false)} resize-none`}
        />
      </div>

      {/* Server error */}
      {serverError && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#C0392B] hover:bg-[#96281B] disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {submitting ? "Sending request…" : "Request Appointment"}
      </button>

      <p className="text-xs text-center text-gray-400">
        We'll confirm within 24 hours by phone or text.
      </p>
    </form>
  );
}

const inputClass = (hasError: boolean) =>
  [
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors",
    "focus:ring-2 focus:ring-offset-0 focus:ring-[#C0392B]",
    hasError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white",
  ].join(" ");

const errClass = "mt-1 text-xs text-red-500";
