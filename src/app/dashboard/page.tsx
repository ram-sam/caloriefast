'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getDailyGoal, getUserCalories } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalorieChart } from '@/components/dashboard/CalorieChart'
import { FastingChart } from '@/components/dashboard/FastingChart'
import { CalorieForm } from '@/components/dashboard/CalorieForm'
import { FastingTimer } from '@/components/dashboard/FastingTimer'
import Link from 'next/link'
import type { Calorie } from '@/types'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [calories, setCalories] = useState<Calorie[]>([])
  const [goal, setGoal] = useState<number>(2000)
  const [loading, setLoading] = useState(true)
  const [todayTotal, setTodayTotal] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userGoal = await getDailyGoal(currentUser.uid)
        setGoal(userGoal || 2000)

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const userCalories = await getUserCalories(currentUser.uid)
        const todayCalories = userCalories.filter(
          (cal) => new Date(cal.date).toDateString() === today.toDateString()
        )
        setCalories(userCalories)
        setTodayTotal(todayCalories.reduce((sum, cal) => sum + cal.calories, 0))
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  const percentage = Math.min((todayTotal / goal) * 100, 100)

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Resumo do dia */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Hoje</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Calorias consumidas
              </p>
              <p className="text-4xl font-bold text-blue-600">{todayTotal}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">de {goal} calorias</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {percentage.toFixed(0)}% da meta
            </p>
          </div>
        </Card>

        {/* Jejum */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Jejum</h2>
          <FastingTimer userId={user?.uid} />
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Calorias (7 dias)</h3>
          <CalorieChart userId={user?.uid} goal={goal} />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Jejum (7 dias)</h3>
          <FastingChart userId={user?.uid} />
        </Card>
      </div>

      {/* Adicionar caloria */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Registrar Refeição</h3>
        <CalorieForm userId={user?.uid} onSuccess={() => window.location.reload()} />
      </Card>

      {/* Links rápidos */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/calories">
          <Button variant="outline" className="w-full">
            Ver Histórico de Calorias
          </Button>
        </Link>
        <Link href="/dashboard/fasting">
          <Button variant="outline" className="w-full">
            Ver Histórico de Jejuns
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="outline" className="w-full">
            Configurações
          </Button>
        </Link>
      </div>
    </div>
  )
}
