"use client";
import { useState } from "react";
import { CartItem } from "@/context/cartContext";
import { Product } from "@/types/product";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    telephone: "",
    email: "",
    address: "",
    zip: "",
    city: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Get cart from localStorage
      const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      // Map cart items to include readable names
      const { products, sizes, colors } = await import('@/utils/store');
      const cartWithNames = cart.map((item: CartItem) => {
        const product = products.find((p: Product) => p.product_id === item.productId);
        const size = sizes.find((s: { id: number; name: string }) => s.id === item.sizeId);
        const color = colors.find((c: { id: number; name: string; color: string }) => c.id === item.colorId);
        return {
          ...item,
          productName: product ? product.product_name : item.productId,
          sizeName: size ? size.name : item.sizeId,
          colorName: color ? color.name : item.colorId,
          price: product ? product.price_inc_vat : '',
        };
      });
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, cart: cartWithNames }),
      });
      if (!res.ok) throw new Error('Failed to send email');
      setSubmitted(true);
      localStorage.removeItem('cart');
    } catch {
      setError('Failed to send order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center font-medium">
          Thank you for your order! We will contact you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Telephone</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Email address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Delivery address</label>
            <input name="address" value={form.address} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Zip</label>
              <input name="zip" value={form.zip} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Comment</label>
            <textarea name="comment" value={form.comment} onChange={handleChange} className="w-full border rounded px-3 py-2 min-h-[80px]" />
          </div>
          {error && <div className="text-red-600 font-medium text-center">{error}</div>}
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold mt-4" disabled={loading}>
            {loading ? 'Sending...' : 'Submit order'}
          </button>
        </form>
      )}
    </div>
  );
}
