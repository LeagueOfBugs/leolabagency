/**
 * email.ts (booking module)
 * Sends confirmation emails via Resend.
 * Called server-side from the appointments API route only.
 */

import { Resend } from "resend";
import type { BookingFormData } from "../types";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing env: RESEND_API_KEY");
  return new Resend(key);
}

function getFromEmail(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("Missing env: RESEND_FROM_EMAIL");
  return from;
}

function getNotificationEmail(): string {
  const to = process.env.BOOKING_NOTIFICATION_EMAIL;
  if (!to) throw new Error("Missing env: BOOKING_NOTIFICATION_EMAIL");
  return to;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(slot: string): string {
  const map: Record<string, string> = {
    morning: "Morning (9am – 12pm)",
    afternoon: "Afternoon (12pm – 4pm)",
    "late-afternoon": "Late Afternoon (4pm – 6pm)",
  };
  return map[slot] ?? slot;
}

/** Email sent to the customer confirming their request was received */
export async function sendCustomerConfirmation(
  data: BookingFormData,
  businessName: string,
  appointmentId: string
): Promise<void> {
  if (!data.email) return; // email is optional

  const resend = getResend();

  await resend.emails.send({
    from: getFromEmail(),
    to: data.email,
    subject: `Appointment Request Received — ${businessName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #2c2c2c;">
        <h2 style="color: #2c2c2c;">Thanks, ${data.name}!</h2>
        <p>We've received your appointment request at <strong>${businessName}</strong>.
        We'll reach out within 24 hours to confirm your time.</p>

        <div style="background: #faf7f2; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #8c7b6b;">
            Your Request
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #8c7b6b; width: 40%;">Service</td><td>${data.service}</td></tr>
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Date</td><td>${formatDate(data.preferred_date)}</td></tr>
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Time</td><td>${formatTime(data.preferred_time)}</td></tr>
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Phone</td><td>${data.phone}</td></tr>
            ${data.notes ? `<tr><td style="padding: 6px 0; color: #8c7b6b;">Notes</td><td>${data.notes}</td></tr>` : ""}
          </table>
        </div>

        <p style="font-size: 13px; color: #8c7b6b;">
          Reference: #${appointmentId.slice(0, 8).toUpperCase()}
        </p>
      </div>
    `,
  });
}

/** Email sent to the business owner notifying of a new booking request */
export async function sendOwnerNotification(
  data: BookingFormData,
  businessName: string,
  appointmentId: string
): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: getFromEmail(),
    to: getNotificationEmail(),
    subject: `New Booking Request — ${data.service} — ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #2c2c2c;">
        <h2 style="color: #2c2c2c;">New Appointment Request</h2>
        <p>Someone just requested an appointment at <strong>${businessName}</strong>.</p>

        <div style="background: #faf7f2; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #8c7b6b; width: 40%;">Name</td><td><strong>${data.name}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Phone</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            ${data.email ? `<tr><td style="padding: 6px 0; color: #8c7b6b;">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>` : ""}
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Service</td><td>${data.service}</td></tr>
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Date</td><td>${formatDate(data.preferred_date)}</td></tr>
            <tr><td style="padding: 6px 0; color: #8c7b6b;">Time</td><td>${formatTime(data.preferred_time)}</td></tr>
            ${data.notes ? `<tr><td style="padding: 6px 0; color: #8c7b6b;">Notes</td><td>${data.notes}</td></tr>` : ""}
          </table>
        </div>

        <p style="font-size: 13px; color: #8c7b6b;">
          Appointment ID: ${appointmentId}
        </p>
      </div>
    `,
  });
}
