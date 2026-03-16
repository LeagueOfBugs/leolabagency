// ============================================================
// Booking module — shared types
// ============================================================

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service: string;
  /** ISO date string e.g. "2026-03-20" */
  preferred_date: string;
  /** "morning" | "afternoon" | "late-afternoon" */
  preferred_time: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
}

export interface CreateAppointmentPayload extends BookingFormData {}

export interface CreateAppointmentResponse {
  appointmentId: string;
  status: AppointmentStatus;
}

/** Config passed as props to BookingWidget / BookingForm */
export interface BookingConfig {
  /** Business name shown in emails and success message */
  businessName: string;
  /** List of service options shown in the select dropdown */
  services: string[];
  /**
   * Days of the week to disable in the date picker.
   * 0 = Sunday, 6 = Saturday. Default: [0] (Sundays only)
   */
  disabledDays?: number[];
  /** Available time slots. Defaults to morning/afternoon/late-afternoon */
  timeSlots?: TimeSlot[];
}

export interface TimeSlot {
  value: string;
  label: string;
}

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { value: "morning", label: "Morning (9am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 4pm)" },
  { value: "late-afternoon", label: "Late Afternoon (4pm – 6pm)" },
];
