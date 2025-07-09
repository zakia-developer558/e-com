import { FaArrowRight } from 'react-icons/fa';

export default function Footer() {
    return (
      <footer className="w-full bg-gray-50">
        <div className="container mx-auto px-12 pt-15 pb-10">
          {/* Main Content */}
          <div className="flex items-start justify-between">
            {/* Left Content */}
            <div className="flex-1 max-w-lg">
              <h2 className="text-5xl text-md font-bold text-gray-900 mb-6 leading-tight">Join the club</h2>
              <p className="text-gray-600 text-md leading-relaxed">
                Get exclusive deals and early access to new products.
              </p>
            </div>
  
            {/* Right Content - Email Form */}
            <div className="flex-shrink-0 ml-8">
              <form className="relative w-120">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-6 py-4 pr-16 text-gray-900 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-gray-300 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 flex items-center justify-center focus:outline-none transition-colors duration-200 rounded-full"
                  aria-label="Subscribe to newsletter"
                >
                  <FaArrowRight className="h-5 w-5 text-gray-900" />
                </button>
              </form>
            </div>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="container mx-auto px-12 pb-12">
          <p className="text-xs text-gray-500"> © 2025 Horizon, Powered by Shopify</p>
        </div>
      </footer>
    )
  }