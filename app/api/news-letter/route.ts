import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL!;
    const fromEmail = process.env.NEWS_LETTER_TO!;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email to admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Newsletter Subscription</h2>
        <p>A new user has subscribed to your newsletter:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p style="margin-top: 20px;">You now have a new subscriber to engage with!</p>
      </div>
    `;

    // Email to subscriber
    const subscriberHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for subscribing!</h2>
        <p>You've successfully subscribed to our newsletter.</p>
        <p>We'll keep you updated with our latest news, offers, and products.</p>
        <p style="margin-top: 20px;">If you didn't request this subscription, please ignore this email.</p>
      </div>
    `;

    // Send email to admin
    await sgMail.send({
      to: adminEmail,
      from: fromEmail,
      subject: `New Newsletter Subscription: ${email}`,
      html: adminHtml,
    });

    // Send confirmation email to subscriber
    await sgMail.send({
      to: email,
      from: fromEmail,
      subject: `Thanks for subscribing to our newsletter!`,
      html: subscriberHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}