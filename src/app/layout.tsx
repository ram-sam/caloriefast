import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CalorieFast - Registro de Calorias e Jejum",
  description: "Acompanhe suas calorias e ciclos de jejum intermitente",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            <p>
              ⚠️ Esta aplicação é apenas para fins educacionais e não substitui
              orientação médica ou nutricional profissional.
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
