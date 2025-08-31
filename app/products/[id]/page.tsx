import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/product-detail-client'

// Dados dos produtos (em uma aplicação real, isso viria de uma API)
const allProducts = [
  {
    id: 1,
    name: "Vestido de Verão Encantado",
    price: "R$ 89,90",
    image: "/vestido-verao-encantado.png",
    alt: "Vestido infantil de verão",
    category: "vestidos",
    description: "Um lindo vestido de verão para sua princesinha! Feito com tecido macio e respirável, perfeito para os dias quentes. Com estampa delicada e corte que permite liberdade de movimento para brincar.",
    features: [
      "Tecido 100% algodão",
      "Corte solto e confortável",
      "Estampa exclusiva",
      "Fácil de lavar",
      "Resistente ao desbotamento"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Rosa", "Azul", "Amarelo"],
    rating: 4.8,
    reviews: 127,
    inStock: true
  },
  {
    id: 2,
    name: "Conjunto Dino Aventureiro",
    price: "R$ 119,90",
    image: "/conjunto-dino-aventureiro.png",
    alt: "Conjunto infantil de dinossauro",
    category: "conjuntos",
    description: "Conjunto super divertido para os pequenos exploradores! Camiseta e bermuda com tema de dinossauros, ideal para aventuras no parque e brincadeiras ao ar livre.",
    features: [
      "Conjunto completo (camiseta + bermuda)",
      "Estampa de dinossauros",
      "Tecido resistente",
      "Confortável para brincar",
      "Costura reforçada"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Verde", "Azul"],
    rating: 4.9,
    reviews: 89,
    inStock: true
  },
  {
    id: 3,
    name: "Macacão Unicórnio Mágico",
    price: "R$ 99,90",
    image: "/macacao-unicornio-magico.png",
    alt: "Macacão infantil de unicórnio",
    category: "macacao",
    description: "Macacão fofo e confortável com tema de unicórnio! Perfeito para ocasiões especiais ou para deixar o dia a dia mais mágico. Tecido macio e design encantador.",
    features: [
      "Design de unicórnio",
      "Tecido super macio",
      "Botões práticos",
      "Corte confortável",
      "Cores vibrantes"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Rosa", "Branco", "Lilás"],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: 4,
    name: "Camiseta Super-Herói",
    price: "R$ 59,90",
    image: "/camiseta-super-heroi.png",
    alt: "Camiseta infantil de super-herói",
    category: "camisetas",
    description: "Camiseta que desperta o super-herói que existe em cada criança! Design moderno e cores vibrantes, perfeita para uso diário e brincadeiras.",
    features: [
      "Estampa de super-herói",
      "100% algodão",
      "Gola reforçada",
      "Lavagem fácil",
      "Durabilidade garantida"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Vermelho", "Azul", "Preto"],
    rating: 4.6,
    reviews: 203,
    inStock: true
  },
  {
    id: 5,
    name: "Shorts Jeans Divertido",
    price: "R$ 69,90",
    image: "/shorts-jeans-divertido.png",
    alt: "Shorts jeans infantil",
    category: "shorts",
    description: "Shorts jeans com design moderno e confortável. Ideal para o verão e atividades ao ar livre. Qualidade premium e acabamento impecável.",
    features: [
      "Jeans de qualidade",
      "Ajuste confortável",
      "Bolsos funcionais",
      "Barra desfiada",
      "Lavagem moderna"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Azul claro", "Azul escuro"],
    rating: 4.5,
    reviews: 178,
    inStock: true
  },
  {
    id: 6,
    name: "Pijama de Estrelas",
    price: "R$ 79,90",
    image: "/pijama-de-estrelas.png",
    alt: "Pijama infantil de estrelas",
    category: "pijamas",
    description: "Pijama mágico para noites de sonhos especiais! Tecido super macio e estampa de estrelas que brilham no escuro. Conforto garantido para uma boa noite de sono.",
    features: [
      "Estrelas que brilham no escuro",
      "Tecido extra macio",
      "Conjunto completo",
      "Elástico confortável",
      "Fácil de vestir"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Azul marinho", "Rosa"],
    rating: 4.9,
    reviews: 245,
    inStock: true
  },
  {
    id: 7,
    name: "Casaco de Inverno Quentinho",
    price: "R$ 150,00",
    image: "/casaco-inverno-quentinho.png",
    alt: "Casaco infantil para o inverno",
    category: "outono-inverno",
    description: "Casaco quentinho para enfrentar o frio com estilo! Forrado internamente e com capuz, oferece proteção e conforto durante todo o inverno.",
    features: [
      "Forro interno quentinho",
      "Capuz removível",
      "Zíper resistente",
      "Bolsos laterais",
      "Impermeável"
    ],
    sizes: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"],
    colors: ["Azul", "Rosa", "Verde"],
    rating: 4.8,
    reviews: 134,
    inStock: true
  },
  {
    id: 8,
    name: "Tênis Colorido",
    price: "R$ 95,00",
    image: "/tenis-colorido-infantil.png",
    alt: "Tênis infantil colorido",
    category: "calcados",
    description: "Tênis super colorido e confortável para os pequenos! Solado antiderrapante e design divertido que combina com qualquer look.",
    features: [
      "Solado antiderrapante",
      "Velcro prático",
      "Cores vibrantes",
      "Palmilha acolchoada",
      "Material respirável"
    ],
    sizes: ["22", "24", "26", "28", "30", "32", "34"],
    colors: ["Multicolor", "Rosa", "Azul"],
    rating: 4.7,
    reviews: 167,
    inStock: true
  },
  {
    id: 9,
    name: "Laço de Cabelo Encantado",
    price: "R$ 25,00",
    image: "/laco-cabelo-encantado.png",
    alt: "Laço de cabelo infantil",
    category: "acessorios",
    description: "Laço delicado para deixar o penteado ainda mais especial! Feito com materiais de qualidade e acabamento perfeito.",
    features: [
      "Material hipoalergênico",
      "Fita de cetim",
      "Presilha resistente",
      "Design delicado",
      "Cores variadas"
    ],
    sizes: ["Único"],
    colors: ["Rosa", "Azul", "Branco", "Amarelo"],
    rating: 4.8,
    reviews: 89,
    inStock: true
  }
];

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const productId = parseInt(id)
  const product = allProducts.find(p => p.id === productId)
  
  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}