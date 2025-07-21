import Link from "next/link"
//hero section
export default function Hero() {
  return (
    <section className="relative w-full h-[60vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://theme-horizon-demo.myshopify.com/cdn/shop/files/055a84a1085545568fbf43ee71d66b1f.png?v=1747669841&width=1950')",
          backgroundPosition: "center top",
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center h-full px-12">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <h1 className="text-8xl font-bold text-white mt-20 mb-4 leading-none">New arrivals</h1>

          {/* CTA Button */}
          <Link
            href="/shop"
            className="inline-block px-4 py-3 text-white border-1 border-white rounded-xl text-lg font-medium hover:bg-white/10 hover:text-white transition-colors duration-300"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  )
}
