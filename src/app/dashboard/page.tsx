"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, LogOut, Plus, UtensilsCrossed, Timer, TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import { MealList } from "@/components/meal-list"
import { MealDialog } from "@/components/meal-dialog"
import { GoalSetting } from "@/components/goal-setting"
import { FastingControl } from "@/components/fasting-control"
import { WeeklyCharts } from "@/components/weekly-charts"
import type { Meal, Goal, Fast } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<Meal[]>([])
  const [goal, setGoal] = useState<Goal | null>(null)
  const [activeFast, setActiveFast] = useState<Fast | null>(null)
  const [showMealDialog, setShowMealDialog] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    setUser(user)
    await loadData(user.id)
    setLoading(false)
  }

  const loadData = async (userId: string) => {
    // Load meals for today
    const today = new Date().toISOString().split('T')[0]
    const { data: mealsData } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('date', today)
      .order('date', { ascending: false })

    if (mealsData) setMeals(mealsData)

    // Load goal
    const { data: goalData } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (goalData) setGoal(goalData)

    // Load active fast
    const { data: fastData } = await supabase
      .from('fasts')
      .select('*')
      .eq('user_id', userId)
      .is('end_time', null)
      .single()

    if (fastData) setActiveFast(fastData)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const todayCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const calorieProgress = goal ? (todayCalories / goal.daily_calories) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">CalorieFast</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Calories Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorias Hoje</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayCalories} kcal</div>
              {goal && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Meta: {goal.daily_calories} kcal
                  </p>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Fasting Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jejum Ativo</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {activeFast ? (
                <div className="text-2xl font-bold text-green-600">Em andamento</div>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">Nenhum</div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refeições Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meals.length}</div>
              <p className="text-xs text-muted-foreground">
                Registradas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <GoalSetting goal={goal} onUpdate={() => loadData(user.id)} />
          <FastingControl activeFast={activeFast} onUpdate={() => loadData(user.id)} />
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Refeições de Hoje</CardTitle>
                <CardDescription>Registre e acompanhe suas refeições</CardDescription>
              </div>
              <Button onClick={() => setShowMealDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Refeição
              </Button>
            </CardHeader>
            <CardContent>
              <MealList meals={meals} onUpdate={() => loadData(user.id)} />
            </CardContent>
          </Card>
        </div>

        <WeeklyCharts userId={user.id} goalCalories={goal?.daily_calories || 2000} />
      </main>

      <MealDialog
        open={showMealDialog}
        onClose={() => setShowMealDialog(false)}
        onSuccess={() => {
          loadData(user.id)
          setShowMealDialog(false)
        }}
      />
    </div>
  )
}
