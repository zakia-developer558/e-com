"use client";
import { FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/news-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setSubscribed(true);
      setEmail('');
    } catch {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-gray-50">
      <div className="container mx-auto px-4 sm:px-12 pt-10 pb-8">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 max-w-lg mb-6 md:mb-0">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Join the club
            </h2>
            <p className="text-gray-600 text-md leading-relaxed">
              Get exclusive deals and early access to new products.
            </p>
          </div>

          {/* Right Content - Email Form */}
          <div className="flex-shrink-0 w-full md:w-auto">
            {subscribed ? (
              <div className="bg-green-100 text-green-800 px-4 py-3 rounded-full text-center">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative w-full md:w-96">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gray-300 placeholder-gray-500"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-0 top-0 h-full px-4 flex items-center justify-center focus:outline-none transition-colors duration-200 rounded-full"
                  aria-label="Subscribe to newsletter"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaArrowRight className="h-5 w-5 text-gray-900" />
                  )}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 sm:px-12 pb-6 sm:pb-12">
        <p className="text-xs text-gray-500 text-center md:text-left">
          © 2025 Horizon, Powered by Shopify
        </p>
      </div>
    </footer>
  );
}