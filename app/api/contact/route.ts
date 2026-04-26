import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_xxxxxxxxx");

const contactRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Invalid email format"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone is too short")
    .max(20, "Phone is too long"),
  message: z.string().trim().min(5, "Message is too short"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = contactRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsedBody.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, phone, message } = parsedBody.data;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY in environment variables" },
        { status: 500 },
      );
    }

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "hi@maenababneh.dev",
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend SDK error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
