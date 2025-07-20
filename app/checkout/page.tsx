"use client";
import { useState } from "react";
import { CartItem } from "@/context/cartContext";
import { Product } from "@/types/product";
import { useCart } from "@/context/cartContext";
import { products, sizes, colors } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
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

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.product_id === item.productId);
    if (!product) return sum;
    const price = Number(product.price_inc_vat?.replace(/[^\d.]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Map cart items to include readable names
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
      clearCart(); // Only clear cart after successful submission
    } catch {
      setError('Failed to send order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {submitted ? (
         <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow-lg">
         <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
           <svg 
             xmlns="http://www.w3.org/2000/svg" 
             className="h-10 w-10 text-green-600" 
             fill="none" 
             viewBox="0 0 24 24" 
             stroke="currentColor"
           >
             <path 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               strokeWidth={2} 
               d="M5 13l4 4L19 7" 
             />
           </svg>
         </div>
         <h3 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h3>
         <p className="text-lg text-green-700 mb-6">
  Thank you for your order. We&apos;ve received it and will contact you soon.
</p>
         <Link 
           href="/products" 
           className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
         >
           Continue Shopping
         </Link>
       </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-2/5 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Your Order</h2>
            
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Your cart is empty</div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => {
                  const product = products.find(p => p.product_id === item.productId);
                  const sizeObj = sizes.find(s => s.id === item.sizeId);
                  const colorObj = colors.find(c => c.id === item.colorId);
                  if (!product) return null;
                  
                  return (
                    <div key={idx} className="flex items-center gap-4 pb-4 border-b">
                      <Image 
                        src={product.product_image} 
                        alt={product.product_name} 
                        width={80} 
                        height={80} 
                        className="w-20 h-20 object-cover rounded"
                        unoptimized
                      />
                      <div className="flex-1">
                        <div className="font-medium">{product.product_name}</div>
                        <div className="text-sm text-gray-500">
                          {colorObj?.name} {sizeObj ? `| ${sizeObj.name}` : ''}
                        </div>
                        <div className="text-sm">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">{product.price_inc_vat}</div>
                    </div>
                  );
                })}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:w-3/5 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Customer Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Full Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <input 
                  name="telephone" 
                  value={form.telephone} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Delivery Address</label>
                <input 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">ZIP Code</label>
                  <input 
                    name="zip" 
                    value={form.zip} 
                    onChange={handleChange} 
                    required 
                    className="w-full border rounded px-3 py-2" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">City</label>
                  <input 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    required 
                    className="w-full border rounded px-3 py-2" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Order Notes (Optional)</label>
                <textarea 
                  name="comment" 
                  value={form.comment} 
                  onChange={handleChange} 
                  className="w-full border rounded px-3 py-2 min-h-[100px]" 
                  placeholder="Any special instructions..."
                />
              </div>
              
              {error && <div className="text-red-600 font-medium text-center">{error}</div>}
              
              <button 
                type="submit" 
                className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold mt-4" 
                disabled={loading || cart.length === 0}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}