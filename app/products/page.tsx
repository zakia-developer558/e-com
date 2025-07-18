"use client";
import ProductGrid from '@/components/product';
import { useState, useRef, Suspense } from 'react';
import { products, colors, sizes } from '@/utils/store';
import { FaChevronDown, FaThLarge, FaBars } from 'react-icons/fa';
import { useEffect } from 'react';
const getUniqueCategories = () => {
  const cats: { id: string, name: string }[] = [];
  products.forEach(p => {
    if (!cats.find(c => c.id === p.category_id)) {
      cats.push({ id: p.category_id, name: p.category_name });
    }
  });
  return cats;
};

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
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showCategory, setShowCategory] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Filtering
  let filtered = products;
  if (category) filtered = filtered.filter(p => p.category_id === category);
  if (color) filtered = filtered.filter(p => p.colors.includes(Number(color)));
  if (size) filtered = filtered.filter(p => p.sizes.includes(Number(size)));

  // Sorting
  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => Number(a.price_inc_vat.replace(/[^\d.]/g, '')) - Number(b.price_inc_vat.replace(/[^\d.]/g, '')));
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => Number(b.price_inc_vat.replace(/[^\d.]/g, '')) - Number(a.price_inc_vat.replace(/[^\d.]/g, '')));
  if (sort === 'name-asc') filtered = [...filtered].sort((a, b) => a.product_name.localeCompare(b.product_name));
  if (sort === 'name-desc') filtered = [...filtered].sort((a, b) => b.product_name.localeCompare(a.product_name));
  if (sort === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  if (sort === 'oldest') filtered = [...filtered].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const categories = getUniqueCategories();

  // Close dropdowns when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
      setShowCategory(false);
      setShowColor(false);
      setShowSize(false);
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
        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Category Dropdown */}
          <div className="relative" ref={sortRef}>
            <button 
              className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[120px] hover:bg-gray-50 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setShowCategory(!showCategory);
                setShowColor(false);
                setShowSize(false);
              }}
            >
              {category ? categories.find(c => c.id === category)?.name || 'Category' : 'Category'}
              <FaChevronDown className={`w-3 h-3 transition-transform ${showCategory ? 'rotate-180' : ''}`} />
            </button>
            {showCategory && (
              <div className="absolute left-0 top-10 mt-1 border rounded bg-white shadow-lg min-w-[160px] z-20 max-h-60 overflow-y-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategory('');
                    setShowCategory(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${category === '' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategory(c.id);
                      setShowCategory(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${category === c.id ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[100px] hover:bg-gray-50 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setShowColor(!showColor);
                setShowCategory(false);
                setShowSize(false);
              }}
            >
              {color ? colors.find(c => String(c.id) === color)?.name || 'Color' : 'Color'}
              <FaChevronDown className={`w-3 h-3 transition-transform ${showColor ? 'rotate-180' : ''}`} />
            </button>
            {showColor && (
              <div 
                className="absolute left-0 top-10 mt-1 bg-white border rounded shadow-lg min-w-[160px] z-20 p-3 grid grid-cols-4 gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => {
                    setColor('');
                    setShowColor(false);
                  }} 
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${color === '' ? 'ring-2 ring-black' : 'border-gray-300'} bg-white`}
                  aria-label="All colors"
                >
                  <span className="w-3 h-3 rounded-full bg-gray-300 block" />
                </button>
                {colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setColor(String(c.id));
                      setShowColor(false);
                    }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${color === String(c.id) ? 'ring-2 ring-black' : 'border-transparent'}`}
                    style={{ backgroundColor: c.color }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Size Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[80px] hover:bg-gray-50 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setShowSize(!showSize);
                setShowCategory(false);
                setShowColor(false);
              }}
            >
              {size ? sizes.find(s => String(s.id) === size)?.name || 'Size' : 'Size'}
              <FaChevronDown className={`w-3 h-3 transition-transform ${showSize ? 'rotate-180' : ''}`} />
            </button>
            {showSize && (
              <div 
                className="absolute left-0 top-10 mt-1 border rounded bg-white shadow-lg min-w-[120px] z-20 max-h-60 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSize('');
                    setShowSize(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${size === '' ? 'bg-gray-100 font-medium' : ''}`}
                >
                  All Sizes
                </button>
                {sizes.map(s => (
                  <button
                    key={s.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSize(String(s.id));
                      setShowSize(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${size === String(s.id) ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sort and View Options */}
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</span>
          
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)} 
            className="border rounded px-3 py-2 min-w-[180px] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
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