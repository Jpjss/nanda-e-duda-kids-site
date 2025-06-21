"use client"

import Link from "next/link"
import Image from "next/image"
import Button from "@/components/ui/button"
import SparklingStars from "@/components/sparkling-stars"

export default function HeroSection() {
  // Função para lidar com a rolagem suave para a seção de produtos
  const handleScrollToProducts = () => {
    // Usar um pequeno timeout para garantir que o DOM esteja completamente renderizado
    // e as posições dos elementos calculadas corretamente.
    setTimeout(() => {
      const productGrid = document.getElementById("product-grid")
      if (productGrid) {
        console.log("Elemento 'product-grid' encontrado:", productGrid)
        console.log("Posição do topo do elemento:", productGrid.getBoundingClientRect().top)

        productGrid.scrollIntoView({
          behavior: "smooth", // Rolagem suave
          block: "start", // Alinha o topo do elemento com o topo da área visível
        })
      } else {
        console.error("Elemento com id 'product-grid' não encontrado. Verifique o ID na seção de produtos.")
      }
    }, 100) // Pequeno atraso de 100ms
  }

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-pink-50 to-blue-50 overflow-hidden flex flex-col items-center justify-center text-center">
      <SparklingStars />
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center gap-6 lg:gap-12 relative z-10">
        <div className="flex flex-col justify-center items-center space-y-4 text-center w-full">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-purple-700 drop-shadow-lg">
              Nanda e Duda Kids
            </h1>
            <p className="max-w-[600px] text-xl md:text-2xl text-pink-800 mx-auto">
              Onde a moda encontra a diversão! Roupas encantadoras para os pequenos aventureiros.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center items-center w-full">
            <Link href="#" passHref>
              <Button className="bg-purple-500 text-white hover:bg-purple-600 text-xl px-10 py-7 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Compre Agora
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-700 hover:bg-purple-100 text-xl px-10 py-7 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={handleScrollToProducts}
            >
              Conheça a Coleção
            </Button>
          </div>
          <div className="relative w-full flex items-center justify-center mt-12 mx-auto">
            <Image
              src="/nanda-duda-kids-logo.png"
              width={900}
              height={300}
              alt="Logo Nanda e Duda Kids - Moda Infantil"
              className="mx-auto aspect-auto overflow-hidden rounded-xl object-contain animate-float"
            />
          </div>
        </div>
        <div className="relative w-full h-[100px] md:h-[100px] lg:h-[200px] flex items-center justify-center">
          <div className="absolute top-5 left-5 w-16 h-16 bg-yellow-300 rounded-full opacity-70 animate-bounce-slow" />
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-green-300 rounded-full opacity-70 animate-bounce-slow delay-200" />
        </div>
      </div>
      <style jsx>{`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animate-bounce-slow {
        animation: bounce-slow 4s ease-in-out infinite;
      }
      .delay-200 {
        animation-delay: 0.2s;
      }
    `}</style>
    </section>
  )
}
