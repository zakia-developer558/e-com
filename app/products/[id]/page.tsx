"use client";
import { useParams } from "next/navigation";
import { products, colors, sizes } from '@/utils/store';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { addToCart } = useCart();
  // Find product after hooks
  const product = products.find(p => p.product_id === id);
  const [selectedColor, setSelectedColor] = useState(product ? product.colors[0] : 0);
  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : 0);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) return notFound();

  // Type guard to filter out undefined
  function isColorDefined(color: typeof colors[number] | undefined): color is typeof colors[number] {
    return color !== undefined;
  }
  const productColors = product.colors.map(cid => colors.find(c => c.id === cid)).filter(isColorDefined);
  const images = product.images.filter(img => !img.color_id || img.color_id === selectedColor);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-100 flex items-center justify-center h-105 rounded-lg overflow-hidden">
            <Image src={images[currentImage]?.product_image || product.product_image} alt={product.product_name} width={400} height={500} className="object-contain max-h-full max-w-full" unoptimized />
          </div>
          <div className="flex gap-2 mt-2">
            {images.map((img, idx) => (
              <button key={idx} onClick={() => setCurrentImage(idx)} className={`w-16 h-16 border ${currentImage === idx ? 'ring-2 ring-black' : ''}`}>
                <Image src={img.product_image} alt={product.product_name + ' thumbnail'} width={64} height={64} className="object-cover w-full h-full" unoptimized />
              </button>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
          <p className="text-xl font-semibold mb-4">
            {product.price_inc_vat} NOK
            {!product.in_stock && <span className="ml-4 text-red-500 font-bold">Out of stock</span>}
          </p>
          <div className="mb-4">
            <span className="font-medium">Color</span>
            <div className="flex gap-2 mt-1">
              {productColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => { setSelectedColor(color.id); setCurrentImage(0); }}
                  className={`w-8 h-8 rounded-full border ${selectedColor === color.id ? 'ring-2 ring-black' : ''}`}
                  style={{ backgroundColor: color.color }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <span className="font-medium">Size</span>
            <div className="flex gap-2 mt-1">
              {product.sizes.map(sizeId => {
                const sizeObj = sizes.find(s => s.id === sizeId);
                return (
                  <button
                    key={sizeId}
                    onClick={() => setSelectedSize(sizeId)}
                    className={`px-3 py-1 border rounded-lg ${selectedSize === sizeId ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    {sizeObj ? sizeObj.name : sizeId}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex mt-6 items-center gap-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-3 py-2 text-lg font-bold text-gray-700 hover:bg-gray-200"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-2 min-w-[32px] text-center">{quantity}</span>
              <button
                className="px-3 py-2 text-lg font-bold text-gray-700 hover:bg-gray-200"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="flex items-center gap-2 bg-black text-white py-2 px-6 rounded-lg text-base font-medium shadow hover:bg-gray-900 transition w-[220px] justify-center"
              onClick={() => {
                addToCart({
                  productId: product.product_id,
                  colorId: selectedColor,
                  sizeId: selectedSize,
                  quantity,
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
              }}
              disabled={added}
            >
              {added ? (
                <>
                  <span className="text-green-400 font-bold text-lg">✓</span> Added
                </>
              ) : (
                <>
                  <FaShoppingCart className="w-5 h-5" /> Add to cart
                </>
              )}
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 pb-5 mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.category_id === product.category_id && p.product_id !== product.product_id)
            .slice(0, 4)
            .map((related) => (
              <div key={related.product_id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/products/${related.product_id}`)}>
                <div className="relative aspect-[3/4] bg-gray-100">
                  <Image
                    src={related.product_image}
                    alt={related.product_name}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{related.product_name}</h3>
                  <p className="text-gray-600">{related.price_inc_vat} NOK</p>
                </div>
              </div>
          ))}
        </div>
      </div>
      {/* Toast Notification */}
      {added && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          Item added successfully!
        </div>
      )}
    </>
  );
} 