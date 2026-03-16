/**
 * app/api/booking/appointments/route.ts  (installed via CLI)
 *
 * POST /api/booking/appointments
 * Body: CreateAppointmentPayload
 *
 * Flow:
 *  1. Validate request body
 *  2. Insert appointment into Supabase (pending status)
 *  3. Send confirmation email to customer (if email provided)
 *  4. Send notification email to business owner
 *  5. Return appointmentId + status
 */

import { NextRequest, NextResponse } from "next/server";
import { createBookingServiceClient } from "@/modules/booking/lib/supabase-client";
import {
  sendCustomerConfirmation,
  sendOwnerNotification,
} from "@/modules/booking/lib/email";
import type { CreateAppointmentPayload } from "@/modules/booking/types";

const BUSINESS_NAME = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Our Business";

export async function POST(req: NextRequest) {
  let body: CreateAppointmentPayload;

  try {
    body = (await req.json()) as CreateAppointmentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Validation ────────────────────────────────────────────────────────
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!body.phone?.trim()) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }
  if (!body.service?.trim()) {
    return NextResponse.json({ error: "service is required" }, { status: 400 });
  }
  if (!body.preferred_date) {
    return NextResponse.json({ error: "preferred_date is required" }, { status: 400 });
  }
  if (!body.preferred_time) {
    return NextResponse.json({ error: "preferred_time is required" }, { status: 400 });
  }

  // ── Insert appointment ────────────────────────────────────────────────
  const supabase = createBookingServiceClient();

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      status: "pending",
      customer_name: body.name.trim(),
      customer_phone: body.phone.trim(),
      customer_email: body.email?.trim() || null,
      service: body.service.trim(),
      preferred_date: body.preferred_date,
      preferred_time: body.preferred_time,
      notes: body.notes?.trim() || null,
    })
    .select("id, status")
    .single();

  if (error || !appointment) {
    console.error("[/api/booking/appointments] insert error:", error);
    return NextResponse.json(
      { error: "Failed to save appointment request" },
      { status: 500 }
    );
  }

  // ── Send emails (non-fatal — log errors but don't fail the request) ───
  const emailPromises = [
    sendOwnerNotification(body, BUSINESS_NAME, appointment.id).catch((e) =>
      console.error("[booking] owner email failed:", e)
    ),
    sendCustomerConfirmation(body, BUSINESS_NAME, appointment.id).catch((e) =>
      console.error("[booking] customer email failed:", e)
    ),
  ];

  // Fire-and-forget — don't block the response on email delivery
  void Promise.all(emailPromises);

  return NextResponse.json({
    appointmentId: appointment.id,
    status: appointment.status,
  });
}
