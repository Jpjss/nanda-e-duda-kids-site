"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { useSearch } from "@/context/search-context"
import { useSearchParams } from "next/navigation" // Importar useSearchParams

export default function ProductGrid() {
  const { searchTerm } = useSearch()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")?.toLowerCase() || ""

  const allProducts = [
    {
      id: 1,
      name: "Vestido de Verão Encantado",
      price: "R$ 89,90",
      image: "/vestido-verao-encantado.png",
      alt: "Vestido infantil de verão",
      category: "vestidos",
    },
    {
      id: 2,
      name: "Conjunto Dino Aventureiro",
      price: "R$ 119,90",
      image: "/conjunto-dino-aventureiro.png",
      alt: "Conjunto infantil de dinossauro",
      category: "conjuntos",
    },
    {
      id: 3,
      name: "Macacão Unicórnio Mágico",
      price: "R$ 99,90",
      image: "/macacao-unicornio-magico.png",
      alt: "Macacão infantil de unicórnio",
      category: "macacao",
    },
    {
      id: 4,
      name: "Camiseta Super-Herói",
      price: "R$ 59,90",
      image: "/camiseta-super-heroi.png",
      alt: "Camiseta infantil de super-herói",
      category: "camisetas",
    },
    {
      id: 5,
      name: "Shorts Jeans Divertido",
      price: "R$ 69,90",
      image: "/shorts-jeans-divertido.png",
      alt: "Shorts jeans infantil",
      category: "shorts",
    },
    {
      id: 6,
      name: "Pijama de Estrelas",
      price: "R$ 79,90",
      image: "/pijama-de-estrelas.png",
      alt: "Pijama infantil de estrelas",
      category: "pijamas",
    },
    // Adicione mais produtos com suas categorias aqui
    {
      id: 7,
      name: "Casaco de Inverno Quentinho",
      price: "R$ 150,00",
      image: "/casaco-inverno-quentinho.png",
      alt: "Casaco infantil para o inverno",
      category: "outono-inverno",
    },
    {
      id: 8,
      name: "Tênis Colorido",
      price: "R$ 95,00",
      image: "/tenis-colorido-infantil.png",
      alt: "Tênis infantil colorido",
      category: "calcados",
    },
    {
      id: 9,
      name: "Laço de Cabelo Encantado",
      price: "R$ 25,00",
      image: "/laco-cabelo-encantado.png",
      alt: "Laço de cabelo infantil",
      category: "acessorios",
    },
  ]

  let currentProducts = allProducts
  let isFilteredByAnything = false

  // 1. Filtrar por categoria (se presente na URL)
  if (categoryParam) {
    currentProducts = currentProducts.filter((product) => product.category?.toLowerCase().includes(categoryParam))
    isFilteredByAnything = true
  }

  // 2. Filtrar por termo de busca (se presente no contexto)
  if (searchTerm) {
    currentProducts = currentProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.alt.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    isFilteredByAnything = true
  }

  const productsToShow = currentProducts
  const showNoResultsMessage = isFilteredByAnything && productsToShow.length === 0
  const suggestedProducts = allProducts.slice(0, 3) // Sugestões para quando não há resultados

  // Determinar o texto do cabeçalho e parágrafo
  const headingText = categoryParam
    ? `Produtos em ${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
    : searchTerm
      ? "Resultados da Pesquisa"
      : "Nossos Produtos"

  const paragraphText = categoryParam
    ? `Descubra nossa seleção de ${categoryParam}!`
    : searchTerm
      ? `Exibindo resultados para "${searchTerm}"`
      : "Descubra a nossa coleção de roupas infantis, feitas com carinho e pensadas para o conforto e a alegria dos seus filhos."

  return (
    <section id="product-grid" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-700">
              {headingText}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-pink-800">
              {paragraphText}
            </p>
          </div>
        </div>
        {productsToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 py-10">
            {productsToShow.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
              >
                <CardHeader className="p-0">
                  <Image
                    src={product.image || "/placeholder.png"}
                    width={300}
                    height={300}
                    alt={product.alt}
                    className="aspect-square object-cover w-full rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col justify-between w-full">
                  <CardTitle className="text-lg font-semibold text-purple-700 mb-2">{product.name}</CardTitle>
                  <p className="text-xl font-bold text-pink-800">{product.price}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 w-full flex flex-col gap-2">
                  {" "}
                  {/* Alterado para flex-col e gap */}
                  <Link href={`/products/${product.id}`} passHref className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-pink-500 text-pink-800 hover:bg-pink-100 transition-colors duration-300 rounded-full"
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button className="w-full bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-300 rounded-full">
                    Adicionar ao Carrinho
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg text-pink-800 mb-8">
              {searchTerm
                ? `Nenhum produto encontrado para "${searchTerm}".`
                : categoryParam
                  ? `Nenhum produto encontrado na categoria "${categoryParam}".`
                  : "Nenhum produto encontrado."}
            </p>
            {showNoResultsMessage && (
              <>
                <h3 className="text-2xl font-bold text-purple-700 mb-6">Sugestões para você:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                  {suggestedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
                    >
                      <CardHeader className="p-0">
                        <Image
                          src={product.image || "/placeholder.png"}
                          width={300}
                          height={300}
                          alt={product.alt}
                          className="aspect-square object-cover w-full rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="p-4 flex-1 flex flex-col justify-between w-full">
                        <CardTitle className="text-lg font-semibold text-purple-700 mb-2">{product.name}</CardTitle>
                        <p className="text-xl font-bold text-pink-800">{product.price}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 w-full flex flex-col gap-2">
                        {" "}
                        {/* Alterado para flex-col e gap */}
                        <Link href={`/products/${product.id}`} passHref className="w-full">
                          <Button
                            variant="outline"
                            className="w-full border-pink-500 text-pink-800 hover:bg-pink-100 transition-colors duration-300 rounded-full"
                          >
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Button className="w-full bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-300 rounded-full">
                          Adicionar ao Carrinho
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
