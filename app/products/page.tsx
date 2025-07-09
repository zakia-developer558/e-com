"use client";
import ProductGrid from '@/components/product';
import { useState, useRef } from 'react';
import { products, colors, sizes } from '@/utils/store';
import { FaChevronDown, FaThLarge, FaBars } from 'react-icons/fa';

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
  const [showSort, setShowSort] = useState(false);
  const [view, setView] = useState('grid');
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
  const selectedColor = colors.find(c => String(c.id) === color);

  // Close sort popover on outside click
  // (simple version, for demo)
  if (typeof window !== 'undefined') {
    window.onclick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false);
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap items-center">
          {/* Category dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[120px]" onClick={e => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
              Category <FaChevronDown className="w-3 h-3" />
            </button>
            <select value={category} onChange={e => setCategory(e.target.value)} className="absolute left-0 top-10 border rounded bg-white shadow min-w-[120px] z-10 hidden" onBlur={e => e.currentTarget.classList.add('hidden')}>
              <option value="">All</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {/* Color dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[100px]" onClick={e => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
              Color <FaChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute left-0 top-10 bg-white border rounded shadow min-w-[120px] z-10 p-2 flex flex-wrap gap-2 hidden" tabIndex={0} onBlur={e => e.currentTarget.classList.add('hidden')}>
              <button onClick={() => setColor('')} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${color === '' ? 'ring-2 ring-black' : ''} bg-white`} aria-label="All colors">
                <span className="w-3 h-3 rounded-full bg-gray-300 block" />
              </button>
              {colors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColor(String(c.id))}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${color === String(c.id) ? 'ring-2 ring-black' : ''}`}
                  style={{ backgroundColor: c.color }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
          {/* Size dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[80px]" onClick={e => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
              Size <FaChevronDown className="w-3 h-3" />
            </button>
            <select value={size} onChange={e => setSize(e.target.value)} className="absolute left-0 top-10 border rounded bg-white shadow min-w-[80px] z-10 hidden" onBlur={e => e.currentTarget.classList.add('hidden')}>
              <option value="">All</option>
              {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Item count */}
          <span className="text-gray-500 text-sm">{filtered.length} items</span>
          {/* Sort dropdown */}
          <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-3 py-2 min-w-[120px]">
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Grid/List toggle */}
          <button className={`p-2 rounded ${view === 'grid' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setView('grid')}><FaThLarge /></button>
          <button className={`p-2 rounded ${view === 'list' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setView('list')}><FaBars /></button>
        </div>
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}