import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { SearchProvider } from "@/context/search-context"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster" // Importar Toaster

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nanda e Duda Kids",
  description: "Loja de roupa infantil com foco no público infantil.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchProvider>
              <Header />
              {children}
            </SearchProvider>
          </Suspense>
          <Toaster /> {/* Adicionar Toaster aqui */}
        </ThemeProvider>
      </body>
    </html>
  )
}
