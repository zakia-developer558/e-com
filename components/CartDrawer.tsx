"use client";
import { useCart } from "@/context/cartContext";
import { products, sizes, colors } from "@/utils/store";
import { FiX, FiTrash } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.product_id === item.productId);
    if (!product) return sum;
    const price = Number(product.price_inc_vat?.replace(/[^\d.]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '400px', maxWidth: '100vw' }}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-3xl font-bold">Cart <span className="ml-2 bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-lg font-medium">{cart.length}</span></h2>
          <button onClick={onClose} className="p-2 text-gray-700 hover:text-black">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12">Your cart is empty.</div>
          ) : (
            cart.map((item, idx) => {
              const product = products.find(p => p.product_id === item.productId);
              const sizeObj = sizes.find(s => s.id === item.sizeId);
              const colorObj = colors.find(c => c.id === item.colorId);
              if (!product) return null;
              return (
                <div key={idx} className="flex items-center gap-4 border-b pb-4">
                  <Image src={product.product_image} alt={product.product_name} width={64} height={64} className="w-16 h-16 object-cover rounded" unoptimized />
                  <div className="flex-1">
                    <div className="font-medium text-lg">{product.product_name}</div>
                    <div className="text-sm text-gray-500">{colorObj ? colorObj.name : ''} {sizeObj ? `| ${sizeObj.name}` : ''}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-medium text-lg">{product.price_inc_vat}</div>
                    <button
                      className="text-gray-400 hover:text-red-600 p-1"
                      aria-label="Remove from cart"
                      onClick={() => removeFromCart({ productId: item.productId, colorId: item.colorId, sizeId: item.sizeId })}
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Subtotal and checkout */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg">Estimated total</span>
            <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500 mb-6">Taxes and shipping calculated at checkout.</div>
          <button className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold mb-2" onClick={() => router.push('/checkout')}>
            Check out
          </button>
        </div>
      </aside>
    </>
  );
} 