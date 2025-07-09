"use client";
import Link from "next/link"
import { LuSearch, LuUser as User, LuShoppingBag as ShoppingBag } from "react-icons/lu"
import { useCart } from "@/context/cartContext"
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <header className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
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

            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200" aria-label="Search">
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
        </div>
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
