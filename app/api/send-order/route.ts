import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { CartItem } from '@/context/cartContext';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { form, cart } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL!;
    const fromEmail = process.env.ORDER_FROM_EMAIL!;
    const userEmail = form.email;

    // Build order details as HTML
    const cartHtml = (cart as (CartItem & { productName: string; sizeName: string; colorName: string; price: string })[]).map((item, idx: number) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.productName}</td>
        <td>${item.sizeName}</td>
        <td>${item.colorName}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
      </tr>
    `).join('');

    const orderHtml = `
      <h2>Order Details</h2>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr><th>#</th><th>Product</th><th>Size</th><th>Color</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>${cartHtml}</tbody>
      </table>
      <h3>Customer Details</h3>
      <ul>
        <li><b>Name:</b> ${form.name}</li>
        <li><b>Telephone:</b> ${form.telephone}</li>
        <li><b>Email:</b> ${form.email}</li>
        <li><b>Address:</b> ${form.address}</li>
        <li><b>Zip:</b> ${form.zip}</li>
        <li><b>City:</b> ${form.city}</li>
        <li><b>Comment:</b> ${form.comment}</li>
      </ul>
    `;

    // Send to admin
    await sgMail.send({
      to: adminEmail,
      from: fromEmail,
      subject: `New Order from ${form.name}`,
      html: orderHtml,
    });
    // Send to user
    await sgMail.send({
      to: userEmail,
      from: fromEmail,
      subject: 'Your Order Confirmation',
      html: `<p>Thank you for your order, ${form.name}!</p>${orderHtml}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
} 