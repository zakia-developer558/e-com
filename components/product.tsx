"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { Product } from '@/types/product';
import { colors, products } from "../utils/store"
import Image from 'next/image';

// Helper function to get variant details
const getVariantDetails = (product: Product, colorId: number | null) => {
  if (!colorId || !product.color_variants) return product;
  
  const variant = product.color_variants.find(v => v.color_id === colorId);
  if (!variant) return product;
  
  return {
    ...product,
    price_inc_vat: variant.price_inc_vat || product.price_inc_vat,
    special_price: variant.special_price || product.special_price,
    product_image: variant.product_image || product.product_image,
    images: product.images.map(img => 
      img.color_id === colorId ? 
        { ...img, product_image: variant.product_image } : 
        img
    )
  };
};

type ProductGridProps = {
  limit?: number;
  products?: Product[];
  view?: 'grid' | 'list';
};

export default function ProductGrid({ 
  limit, 
  products: overrideProducts, 
  view = 'grid' 
}: ProductGridProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>(
    products.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.product_id] = 0
      return acc
    }, {} as Record<string, number>)
  )

  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(
    products.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.product_id] = product.colors[0];
      return acc;
    }, {})
  );

  // On mount, update selectedColors from searchParams
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSelectedColors(prev => {
      const updated: Record<string, number> = { ...prev };
      products.forEach(product => {
        const colorParam = searchParams.get(`color_${product.product_id}`);
        if (colorParam) {
          updated[product.product_id] = Number(colorParam);
        }
      });
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  
  // Update URL when color changes
  useEffect(() => {
    Object.keys(selectedColors).forEach(productId => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(`color_${productId}`, selectedColors[productId].toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [selectedColors, router, searchParams]);

  const getFilteredImages = (product: Product) => {
    const selectedColor = selectedColors[product.product_id];
    if (!selectedColor) return product.images;
    return product.images.filter(img => 
      !img.color_id || img.color_id === selectedColor
    );
  };

  const nextImage = (productId: string, imagesLength: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: prev[productId] === imagesLength - 1 ? 0 : prev[productId] + 1
    }))
  }

  const prevImage = (productId: string, imagesLength: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: prev[productId] === 0 ? imagesLength - 1 : prev[productId] - 1
    }))
  }

  const handleColorSelect = (colorId: number, productId: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: colorId
    }));
    
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set(`color_${productId}`, colorId.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  const baseProducts = overrideProducts || products;
  const shownProducts = limit ? baseProducts.slice(0, limit) : baseProducts;

  return (
    <section className="w-full py-8">
      <div className="px-4 sm:px-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {shownProducts.map((product: Product) => (
              <ProductCard 
                key={product.product_id}
                product={product}
                selectedColor={selectedColors[product.product_id]}
                currentImageIndex={currentImageIndices[product.product_id]}
                onColorSelect={handleColorSelect}
                onPrevImage={prevImage}
                onNextImage={nextImage}
                router={router}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {shownProducts.map((product: Product) => (
              <ProductListItem 
                key={product.product_id}
                product={product}
                selectedColor={selectedColors[product.product_id]}
                currentImageIndex={currentImageIndices[product.product_id]}
                onColorSelect={handleColorSelect}
                onPrevImage={prevImage}
                onNextImage={nextImage}
                router={router}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Product Card Component for Grid View
const ProductCard = ({ 
  product, 
  selectedColor, 
  currentImageIndex, 
  onColorSelect, 
  onPrevImage, 
  onNextImage, 
  router 
}: {
  product: Product;
  selectedColor: number;
  currentImageIndex: number;
  onColorSelect: (colorId: number, productId: string) => void;
  onPrevImage: (productId: string, imagesLength: number) => void;
  onNextImage: (productId: string, imagesLength: number) => void;
  router: any;
}) => {
  const variant = getVariantDetails(product, selectedColor);
  const filteredImages = product.images.filter(img => 
    !img.color_id || img.color_id === selectedColor
  );

  return (
    <div 
      className="group cursor-pointer" 
      onClick={() => router.push(`/products/${product.product_id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
        <Image
          src={currentImageIndex === 0 ? 
            variant.product_image : 
            filteredImages[currentImageIndex]?.product_image || variant.product_image}
          alt={product.product_name}
          width={300}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage(product.product_id, filteredImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextImage(product.product_id, filteredImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Next image"
            >
              <FaChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 leading-tight">{product.product_name}</h3>
        <p className="text-sm text-gray-900 font-medium">
          {variant.price_inc_vat} NOK
          {variant.special_price && (
            <span className="ml-2 text-red-500 line-through">
              {variant.special_price} NOK
            </span>
          )}
        </p>

        {/* Color Swatches */}
        <div className="flex gap-2 pt-1">
          {product.colors.map((colorId) => {
            const color = colors.find(c => c.id === colorId);
            if (!color) return null;
            
            return (
              <button
                key={color.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onColorSelect(color.id, product.product_id)
                }}
                className={`w-5 h-5 rounded-full border ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                style={{ backgroundColor: color.color }}
                aria-label={`Select ${color.name} color`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Product List Item Component for List View
const ProductListItem = ({ 
  product, 
  selectedColor, 
  currentImageIndex, 
  onColorSelect, 
  onPrevImage, 
  onNextImage, 
  router 
}: {
  product: Product;
  selectedColor: number;
  currentImageIndex: number;
  onColorSelect: (colorId: number, productId: string) => void;
  onPrevImage: (productId: string, imagesLength: number) => void;
  onNextImage: (productId: string, imagesLength: number) => void;
  router: any;
}) => {
  const variant = getVariantDetails(product, selectedColor);
  const filteredImages = product.images.filter(img => 
    !img.color_id || img.color_id === selectedColor
  );

  return (
    <div 
      className="flex flex-col sm:flex-row gap-6 group cursor-pointer border-b pb-8"
      onClick={() => router.push(`/products/${product.product_id}`)}
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-1/3 aspect-[4/5] bg-gray-100 overflow-hidden">
        <Image
          src={currentImageIndex === 0 ? 
            variant.product_image : 
            filteredImages[currentImageIndex]?.product_image || variant.product_image}
          alt={product.product_name}
          width={400}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage(product.product_id, filteredImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextImage(product.product_id, filteredImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Next image"
            >
              <FaChevronRight className="w-4 h-4 text-gray-900" />
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="w-full sm:w-2/3 flex flex-col justify-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.product_name}</h3>
        <p className="text-lg text-gray-900 font-medium mb-4">
          {variant.price_inc_vat} NOK
          {variant.special_price && (
            <span className="ml-2 text-red-500 line-through">
              {variant.special_price} NOK
            </span>
          )}
        </p>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {product.description || 'No description available'}
        </p>

        {/* Color Swatches */}
        <div className="flex gap-2">
          {product.colors.map((colorId) => {
            const color = colors.find(c => c.id === colorId);
            if (!color) return null;
            
            return (
              <button
                key={color.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onColorSelect(color.id, product.product_id)
                }}
                className={`w-6 h-6 rounded-full border ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                style={{ backgroundColor: color.color }}
                aria-label={`Select ${color.name} color`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};