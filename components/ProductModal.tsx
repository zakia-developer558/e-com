import React, { useState } from 'react';
import Image from 'next/image';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { Product } from '@/types/product';
import { sizes } from '../utils/store';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  selectedColor: number | null;
  onAddToCart: (options: { productId: string; colorId: number; sizeId: number; quantity: number }) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, product, selectedColor, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Always call hooks first!
  React.useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  // Only render modal if open and product/selectedColor are set
  if (!open || !product || !selectedColor) return null;
  const productImage = product.product_image;
  const price = product.price_inc_vat;
  const specialPrice = product.special_price;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 flex flex-col md:flex-row overflow-hidden z-50 animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX className="w-6 h-6" />
        </button>
        {/* Left: Image */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-100 p-6">
          <Image
            src={productImage}
            alt={product.product_name}
            width={320}
            height={400}
            className="rounded-lg object-cover w-full h-auto max-h-96"
            unoptimized
          />
        </div>
        {/* Right: Details */}
        <div className="md:w-1/2 w-full p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">{product.product_name}</h2>
          <div className="text-lg font-semibold text-gray-900 mb-2">{price} NOK {specialPrice && <span className="ml-2 text-red-500 line-through">{specialPrice} NOK</span>}</div>
          <div className="text-gray-600 mb-2">{product.description}</div>
          {/* Size Selection */}
          <div className="mb-2">
            <div className="font-medium mb-1">Size</div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(sizeId => {
                const sizeObj = sizes.find(s => s.id === sizeId);
                if (!sizeObj) return null;
                return (
                  <button
                    key={sizeObj.id}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${selectedSize === sizeObj.id ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300'}`}
                    onClick={() => setSelectedSize(sizeObj.id)}
                  >
                    {sizeObj.name}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Quantity Selector */}
          <div className="mb-4 flex items-center gap-3">
            <div className="font-medium">Quantity</div>
            <button
              className="w-8 h-8 rounded border flex items-center justify-center text-lg font-bold disabled:opacity-50"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              className="w-8 h-8 rounded border flex items-center justify-center text-lg font-bold"
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {/* Add to Cart Button */}
          <button
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition"
            onClick={() => {
              if (selectedSize) {
                onAddToCart({
                  productId: product.product_id,
                  colorId: selectedColor,
                  sizeId: selectedSize,
                  quantity,
                });
                onClose();
              }
            }}
            disabled={!selectedSize}
          >
            <FiShoppingBag className="w-5 h-5" /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 