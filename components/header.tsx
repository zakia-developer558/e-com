"use client";
import Link from "next/link"
import { LuSearch, LuUser as User, LuShoppingBag as ShoppingBag } from "react-icons/lu"
import { useCart } from "@/context/cartContext"
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { products } from "@/utils/store";
import { useRouter } from "next/navigation";
import React from "react";
import { LuMenu } from "react-icons/lu";
import { Fragment } from "react";

export default function Header() {
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Filter products by name
  const filtered = search
    ? products.filter(p => p.product_name.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Close search on outside click or Escape
  React.useEffect(() => {
    if (!searchOpen) return;
    function handle(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent && e.key === "Escape") setSearchOpen(false);
      if (e instanceof MouseEvent && !(e.target as HTMLElement).closest("#search-dropdown")) setSearchOpen(false);
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handle);
    };
  }, [searchOpen]);
  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 relative">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Mobile Header Layout */}
          <div className="flex md:hidden items-center justify-between h-16 relative">
            {/* Left icons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
                <LuMenu className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900" aria-label="Search" onClick={() => setSearchOpen(v => !v)}>
                <LuSearch className="h-5 w-5" />
              </button>
            </div>
            {/* Centered logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-gray-900">
              Horizon
            </Link>
            {/* Right icons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-700 hover:text-gray-900" aria-label="Account">
                <User className="h-5 w-5" />
              </button>
              <button
                className="relative p-2 text-gray-700 hover:text-gray-900"
                aria-label="Cart"
                onClick={() => setDrawerOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* Desktop Header Layout */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Horizon
              </Link>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                  Shop
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200" aria-label="Search" onClick={() => setSearchOpen(v => !v)}>
                <LuSearch className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200" aria-label="Account">
                <User className="h-5 w-5" />
              </button>
              <button
                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Cart"
                onClick={() => setDrawerOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* Search Dropdown (works on both mobile and desktop) */}
          {searchOpen && (
            <div
              id="search-dropdown"
              className="z-50"
              style={{ position: 'fixed', left: 0, right: 0, top: '4rem', width: '100%' }}
            >
              <div className="mx-auto max-w-md md:max-w-none md:w-80 md:absolute md:right-24 md:top-0 md:left-auto md:mx-0 md:rounded md:shadow-lg md:border bg-white border rounded shadow-lg p-4">
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                {search && (
                  <ul className="max-h-60 overflow-y-auto divide-y">
                    {filtered.length === 0 ? (
                      <li className="p-2 text-gray-500">No products found.</li>
                    ) : (
                      filtered.map(p => (
                        <li key={p.product_id}>
                          <button
                            className="w-full text-left p-2 hover:bg-gray-100 rounded"
                            onClick={() => {
                              setSearchOpen(false);
                              setSearch("");
                              router.push(`/products/${p.product_id}`);
                            }}
                          >
                            {p.product_name}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
          {/* Mobile Slide Menu */}
          <Fragment>
            <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileNavOpen(false)} />
            <nav className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ willChange: 'transform' }}>
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-semibold">Menu</span>
                <button className="p-2 text-gray-700 hover:text-gray-900" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                  <LuMenu className="h-6 w-6 rotate-90" />
                </button>
              </div>
              <div className="flex flex-col p-4 space-y-2">
                <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors duration-200" onClick={() => setMobileNavOpen(false)}>
                  Shop
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors duration-200" onClick={() => setMobileNavOpen(false)}>
                  Contact
                </Link>
              </div>
            </nav>
          </Fragment>
        </div>
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
