
import Hero from "@/components/hero";
import ProductGrid from "@/components/product";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      
      <div className="flex-1">
        <Hero />
        <ProductGrid limit={8} />
      </div>
      
    </main>
  );
}
