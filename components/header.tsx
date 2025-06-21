"use client"

import Link from "next/link"
import { Search, MessageSquareText, User, ShoppingCart, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Button from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useSearch } from "@/context/search-context"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast" // Assumindo que useToast está disponível

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleCategoryClick = (category: string) => {
    setSearchTerm("") // Limpa o termo de busca ao clicar em uma categoria
    router.push(`${pathname}?category=${category}`)
  }

  const handleHomeClick = () => {
    setSearchTerm("") // Limpa o termo de busca ao voltar para o início
    router.push(pathname) // Volta para a rota base, removendo query params
  }

  return (
    <header className="w-full">
      {/* Top Announcement Bar */}
      <div className="bg-pink-header-dark text-white text-center py-2 text-sm">
        Colorindo a Infância com lookinhos para Meninas e Meninos 
      </div>

      {/* Main Header Section */}
      <div className="bg-pink-header-light py-4 px-6 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" prefetch={false} onClick={handleHomeClick}>
          <span className="text-3xl font-extrabold text-purple-700">Nanda e Duda</span>
          <span className="text-2xl font-bold text-pink-500 ml-1">Kids</span>
        </Link>

        {/* Search Trigger (opens dialog) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-pink-800 hover:bg-pink-100 flex-shrink-0 md:hidden" // Visível em mobile
              aria-label="Abrir pesquisa"
            >
              <Search className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-pink-800" />
              <Input
                type="search"
                placeholder="O que você está buscando?"
                className="flex-1 py-2 rounded-md bg-white text-pink-800 placeholder:text-pink-400 border focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Search Bar (desktop only) */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Input
            type="search"
            placeholder="O que você está buscando?"
            className="w-full pl-4 pr-10 py-2 rounded-full bg-white text-pink-800 placeholder:text-pink-400 border-none focus:ring-2 focus:ring-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-800 hover:bg-pink-100"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 md:gap-6 text-pink-800">
          <Link
            href="#"
            className="flex flex-col items-center text-xs hover:text-purple-700 transition-colors"
            prefetch={false}
          >
            <MessageSquareText className="h-6 w-6" />
            Atendimento
          </Link>
          <Link
            href="/login" // Link para a página de login
            className="flex flex-col items-center text-xs hover:text-purple-700 transition-colors"
            prefetch={false}
          >
            <User className="h-6 w-6" />
            Minha conta
          </Link>
          <Link
            href="#"
            className="relative flex flex-col items-center text-xs hover:text-purple-700 transition-colors"
            prefetch={false}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              0
            </span>
            Meu carrinho
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Menu */}
      <nav className="bg-pink-100 py-3 px-6 flex justify-center gap-6 md:gap-8 text-pink-800 text-sm font-medium">
        <Link href="/" className="hover:text-purple-700 transition-colors" prefetch={false} onClick={handleHomeClick}>
          Início
        </Link>
        <Link
          href="/?category=vestidos"
          className="hover:text-purple-700 transition-colors"
          prefetch={false}
          onClick={() => handleCategoryClick("vestidos")}
        >
          Vestidos
        </Link>
        <Link
          href="/?category=macacao"
          className="hover:text-purple-700 transition-colors"
          prefetch={false}
          onClick={() => handleCategoryClick("macacao")}
        >
          Macacão
        </Link>
        <Link
          href="/?category=conjuntos"
          className="hover:text-purple-700 transition-colors"
          prefetch={false}
          onClick={() => handleCategoryClick("conjuntos")}
        >
          Conjuntos
        </Link>
        <Link
          href="/?category=outono-inverno"
          className="hover:text-purple-700 transition-colors"
          prefetch={false}
          onClick={() => handleCategoryClick("outono-inverno")}
        >
          Outono/Inverno
        </Link>
        <Link
          href="/?category=calcados"
          className="hover:text-purple-700 transition-colors"
          prefetch={false}
          onClick={() => handleCategoryClick("calcados")}
        >
          Calçados
        </Link>
        <Link
          href="/?category=acessorios"
          className="hover:text-purple-700 transition-colors"
          prefetch={false}
          onClick={() => handleCategoryClick("acessorios")}
        >
          Acessórios
        </Link>
        {/* "Ver tudo" como DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-purple-700 transition-colors focus:outline-none">
            Ver tudo
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white shadow-lg rounded-md py-1">
            <DropdownMenuItem>
              <Link
                href="/?category=categoria1"
                className="block px-4 py-2 text-sm text-pink-800 hover:bg-pink-50"
                prefetch={false}
                onClick={() => handleCategoryClick("categoria1")}
              >
                Categoria 1
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/?category=categoria2"
                className="block px-4 py-2 text-sm text-pink-800 hover:bg-pink-50"
                prefetch={false}
                onClick={() => handleCategoryClick("categoria2")}
              >
                Categoria 2
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/?category=categoria3"
                className="block px-4 py-2 text-sm text-pink-800 hover:bg-pink-50"
                prefetch={false}
                onClick={() => handleCategoryClick("categoria3")}
              >
                Categoria 3
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
