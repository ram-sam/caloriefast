"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts"
import { calculateDuration } from "@/lib/utils"
import type { Meal, Fast } from "@/types"

interface WeeklyChartsProps {
  userId: string
  goalCalories: number
}

export function WeeklyCharts({ userId, goalCalories }: WeeklyChartsProps) {
  const supabase = createClient()
  const [caloriesData, setCaloriesData] = useState<any[]>([])
  const [fastingData, setFastingData] = useState<any[]>([])
  const [stats, setStats] = useState({
    avgCalories: 0,
    totalFasts: 0,
    avgFastingHours: 0
  })

  useEffect(() => {
    loadWeeklyData()
  }, [userId])

  const loadWeeklyData = async () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)

    // Load meals
    const { data: meals } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo.toISOString())
      .order('date', { ascending: true })

    // Load fasts
    const { data: fasts } = await supabase
      .from('fasts')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', sevenDaysAgo.toISOString())
      .not('end_time', 'is', null)
      .order('start_time', { ascending: true })

    if (meals) {
      processCaloriesData(meals as Meal[], sevenDaysAgo)
    }

    if (fasts) {
      processFastingData(fasts as Fast[], sevenDaysAgo)
      calculateStats(meals as Meal[], fasts as Fast[])
    }
  }

  const processCaloriesData = (meals: Meal[], startDate: Date) => {
    const dailyData: { [key: string]: number } = {}
    
    // Initialize all 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dailyData[dateStr] = 0
    }

    // Sum calories per day
    meals.forEach(meal => {
      const dateStr = meal.date.split('T')[0]
      if (dailyData.hasOwnProperty(dateStr)) {
        dailyData[dateStr] += meal.calories
      }
    })

    // Convert to chart format
    const chartData = Object.entries(dailyData).map(([date, calories]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      calories: calories,
      meta: goalCalories
    }))

    setCaloriesData(chartData)
  }

  const processFastingData = (fasts: Fast[], startDate: Date) => {
    const dailyData: { [key: string]: number } = {}
    
    // Initialize all 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dailyData[dateStr] = 0
    }

    // Sum fasting hours per day
    fasts.forEach(fast => {
      if (fast.end_time) {
        const dateStr = fast.start_time.split('T')[0]
        if (dailyData.hasOwnProperty(dateStr)) {
          const duration = calculateDuration(fast.start_time, fast.end_time)
          dailyData[dateStr] += duration
        }
      }
    })

    // Convert to chart format
    const chartData = Object.entries(dailyData).map(([date, hours]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      horas: Math.round(hours * 10) / 10
    }))

    setFastingData(chartData)
  }

  const calculateStats = (meals: Meal[], fasts: Fast[]) => {
    // Group meals by day
    const dailyCalories: { [key: string]: number } = {}
    meals.forEach(meal => {
      const dateStr = meal.date.split('T')[0]
      dailyCalories[dateStr] = (dailyCalories[dateStr] || 0) + meal.calories
    })

    const avgCalories = Object.keys(dailyCalories).length > 0
      ? Object.values(dailyCalories).reduce((a, b) => a + b, 0) / Object.keys(dailyCalories).length
      : 0

    const completedFasts = fasts.filter(f => f.end_time)
    const totalFasts = completedFasts.length

    const avgFastingHours = totalFasts > 0
      ? completedFasts.reduce((sum, fast) => {
          if (fast.end_time) {
            return sum + calculateDuration(fast.start_time, fast.end_time)
          }
          return sum
        }, 0) / totalFasts
      : 0

    setStats({
      avgCalories: Math.round(avgCalories),
      totalFasts,
      avgFastingHours: Math.round(avgFastingHours * 10) / 10
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Média Diária (7 dias)</CardDescription>
            <CardTitle className="text-2xl">{stats.avgCalories} kcal</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Jejuns Concluídos</CardDescription>
            <CardTitle className="text-2xl">{stats.totalFasts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Média de Jejum</CardDescription>
            <CardTitle className="text-2xl">{stats.avgFastingHours}h</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Calories Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Calorias - Últimos 7 Dias</CardTitle>
          <CardDescription>
            Comparação com sua meta diária
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={caloriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={goalCalories} stroke="#666" strokeDasharray="3 3" label="Meta" />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Calorias"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fasting Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Jejum - Últimos 7 Dias</CardTitle>
          <CardDescription>
            Horas de jejum por dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fastingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="horas" fill="#22c55e" name="Horas de Jejum" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
