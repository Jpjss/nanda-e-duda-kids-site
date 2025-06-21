import HeroSection from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"
import Link from "next/link"
import { Instagram, PhoneIcon as WhatsappIcon } from "lucide-react" // Changed PhoneIcon to WhatsappIcon

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <ProductGrid />
      </main>
      <footer className="bg-pink-100 py-6 text-center text-sm text-pink-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Nanda e Duda Kids. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link
              href="https://api.whatsapp.com/send?phone=5562985153410&text=estou%2Bvindo%2Bdo%2Binstagram%2B%25F0%259F%2593%25B2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Nanda e Duda Kids"
            >
              <WhatsappIcon className="h-6 w-6 text-pink-800 hover:text-purple-700 transition-colors" />
            </Link>
            <Link
              href="https://www.instagram.com/nandadudakids?igsh=Z3pxdW5pYjU2cW5h"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Nanda e Duda Kids"
            >
              <Instagram className="h-6 w-6 text-pink-800 hover:text-purple-700 transition-colors" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
