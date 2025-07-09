import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, comment } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL!;
    const fromEmail = process.env.FROM_EMAIL!;

    const html = `
      <h2>Contact Form Submission</h2>
      <ul>
        <li><b>Name:</b> ${name}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Phone:</b> ${phone}</li>
        <li><b>Comment:</b> ${comment}</li>
      </ul>
    `;

    await sgMail.send({
      to: adminEmail,
      from: fromEmail,
      subject: `Contact Form Submission from ${name}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
} 