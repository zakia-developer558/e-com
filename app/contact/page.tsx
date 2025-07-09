"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", comment: "" });
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send email');
      setSubmitted(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-12 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">Contact</h1>
      <p className="text-center text-gray-600 mb-10">
        Have a question, comment, or concern? Let us know and we will get in touch with you as soon as possible.
      </p>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center font-medium">
          Thank you for contacting us! We will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-1/2 border-2 border-gray-300 rounded px-3 py-2"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-1/2 border-2 border-gray-300 rounded px-3 py-2"
            />
          </div>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full  border-2 border-gray-300 rounded px-3 py-2"
          />
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Comment"
            required
            className="w-full border-2 border-gray-300 rounded px-3 py-2 min-h-[180px]"
          />
          {error && <div className="text-red-600 font-medium text-center">{error}</div>}
          <button type="submit" className="bg-black text-white px-8 py-3 rounded-lg font-medium mt-2 hover:bg-gray-900" style={{ minWidth: 100 }} disabled={loading}>
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}
