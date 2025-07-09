
import Hero from "@/components/hero";
import ProductGrid from "@/components/product";
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      
      <div className="flex-1">
        <Hero />
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid limit={8} />
        </Suspense>
      </div>
      
    </main>
  );
}
