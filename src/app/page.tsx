'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (user) {
        router.push('/dashboard')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            CalorieFast
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Acompanhe suas calorias e ciclos de jejum intermitente
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="px-8">
                Cadastrar
              </Button>
            </Link>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-2">⚠️ Aviso Importante</p>
            <p>
              Esta aplicação é um exercício acadêmico e <strong>não substitui</strong> orientação médica ou nutricional profissional.
              Consulte um médico ou nutricionista antes de iniciar qualquer regime de jejum ou restrição calórica.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
