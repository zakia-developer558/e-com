"use client";
import ProductGrid from '@/components/product';
import { useState, useRef, Suspense } from 'react';
import { products, colors } from '@/utils/store';
import { FaChevronDown, FaThLarge, FaBars } from 'react-icons/fa';
import { useEffect } from 'react';


const sortOptions = [
  { value: 'newest', label: 'Date, new to old' },
  { value: 'oldest', label: 'Date, old to new' },
  { value: 'name-asc', label: 'Alphabetically, A-Z' },
  { value: 'name-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
];

export default function ProductsPage() {
  const [sort, setSort] = useState('newest');
  const [stock, setStock] = useState('');
  const [showStock, setShowStock] = useState(false);
  const [color, setColor] = useState<string[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showColor, setShowColor] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Filtering
  let filtered = products;
  if (stock === 'in') filtered = filtered.filter(p => p.in_stock);
  if (stock === 'out') filtered = filtered.filter(p => !p.in_stock);
  if (color.length > 0) filtered = filtered.filter(p => p.colors.some(c => color.includes(String(c))));

  // Sorting
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => Number(a.price_inc_vat.replace(/[^\d.]/g, '')) - Number(b.price_inc_vat.replace(/[^\d.]/g, '')));
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => Number(b.price_inc_vat.replace(/[^\d.]/g, '')) - Number(a.price_inc_vat.replace(/[^\d.]/g, '')));
  if (sort === 'name-asc') filtered = [...filtered].sort((a, b) => a.product_name.localeCompare(b.product_name));
  if (sort === 'name-desc') filtered = [...filtered].sort((a, b) => b.product_name.localeCompare(a.product_name));
  if (sort === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  if (sort === 'oldest') filtered = [...filtered].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Close dropdowns when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
      setShowStock(false);
      setShowColor(false);
      setShowSort(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Filters (left) */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Availability Dropdown */}
          <div className="relative" ref={sortRef}>
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded w-[140px] transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setShowStock(!showStock);
                setShowColor(false);
              }}
            >
              <span>{stock === 'in' ? 'In Stock' : stock === 'out' ? 'Out of Stock' : 'Availability'}</span>
              <FaChevronDown className={`w-3 h-3 transition-transform ${showStock ? 'rotate-180' : ''}`} />
            </button>
            {showStock && (
              <div className="absolute left-0 top-10 mt-1 bg-white shadow-lg rounded min-w-[160px] z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStock('');
                    setShowStock(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${stock === '' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  All
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStock('in');
                    setShowStock(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${stock === 'in' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  In Stock
                </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    setStock('out');
                    setShowStock(false);
                    }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${stock === 'out' ? 'bg-gray-100 font-medium' : ''}`}
                  >
                  Out of Stock
                  </button>
              </div>
            )}
          </div>

          {/* Color Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded w-[120px] transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setShowColor(!showColor);
                setShowStock(false);
                setShowSort(false);
              }}
            >
              <span className="flex items-center gap-1">
                {color.length > 0
                  ? color.map((cid, idx) => {
                      const c = colors.find(col => String(col.id) === cid);
                      if (!c) return null;
                      return (
                        <span
                          key={c.id}
                          className={`inline-block w-5 h-5 rounded-full border ${idx !== 0 ? '-ml-3' : ''}`}
                          style={{ backgroundColor: c.color, border: '2px solid #fff', zIndex: 10 + idx }}
                        />
                      );
                    })
                  : 'Color'}
              </span>
              <FaChevronDown className={`w-3 h-3 transition-transform ${showColor ? 'rotate-180' : ''}`} />
            </button>
            {showColor && (
              <div 
                className="absolute left-0 top-10 mt-1 bg-white shadow-lg rounded min-w-[160px] z-20 p-3 grid grid-cols-4 gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => {
                    setColor([]);
                    setShowColor(false);
                  }} 
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${color.length === 0 ? 'ring-2 ring-black' : 'border-gray-300'} bg-white`}
                  aria-label="All colors"
                >
                  <span className="w-3 h-3 rounded-full bg-gray-300 block" />
                </button>
                {colors.map(c => (
                  <button
                    key={c.id}
                    onClick={e => {
                      e.stopPropagation();
                      setColor(prev =>
                        prev.includes(String(c.id))
                          ? prev.filter(id => id !== String(c.id))
                          : [...prev, String(c.id)]
                      );
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${color.includes(String(c.id)) ? 'ring-2 ring-black' : 'border-transparent'}`}
                    style={{ backgroundColor: c.color }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            )}
          </div>
          </div>

        {/* Sort and View Options (right) */}
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</span>
          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded w-[120px] transition-colors"
              onClick={e => {
                e.stopPropagation();
                setShowSort(!showSort);
                setShowStock(false);
                setShowColor(false);
              }}
            >
              <span>Sort</span>
              <FaChevronDown className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
            {showSort && (
              <div className="absolute left-0 top-10 mt-1 bg-white shadow-lg rounded min-w-[180px] z-20">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={e => {
                      e.stopPropagation();
                      setSort(opt.value);
                      setShowSort(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${sort === opt.value ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* View Options */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded">
            <button 
              className={`p-2 rounded transition-colors ${view === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'}`} 
              onClick={() => setView('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <FaThLarge />
            </button>
            <button 
              className={`p-2 rounded transition-colors ${view === 'list' ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'}`} 
              onClick={() => setView('list')}
              aria-label="List view"
              title="List view"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
        <ProductGrid products={filtered} view={view} />
      </Suspense>
    </div>
  );
}