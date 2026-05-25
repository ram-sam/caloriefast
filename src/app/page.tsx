import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, Timer, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-green-600 dark:text-green-400">
            CalorieFast
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Controle suas calorias e acompanhe seu jejum intermitente
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Criar Conta</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <UtensilsCrossed className="h-12 w-12 mb-4 text-green-600" />
              <CardTitle>Registre Refeições</CardTitle>
              <CardDescription>
                Acompanhe suas calorias diárias com facilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Registre café, almoço, lanches e jantares. Defina metas personalizadas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Timer className="h-12 w-12 mb-4 text-green-600" />
              <CardTitle>Jejum Intermitente</CardTitle>
              <CardDescription>
                Controle seus ciclos de jejum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suporte para 16:8, 18:6, 20:4, 24h ou personalizado.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 mb-4 text-green-600" />
              <CardTitle>Visualize Progresso</CardTitle>
              <CardDescription>
                Gráficos e estatísticas semanais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acompanhe tendências e atinja suas metas com dados claros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
