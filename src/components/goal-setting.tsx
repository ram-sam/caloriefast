"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target } from "lucide-react"
import type { Goal } from "@/types"

interface GoalSettingProps {
  goal: Goal | null
  onUpdate: () => void
}

export function GoalSetting({ goal, onUpdate }: GoalSettingProps) {
  const supabase = createClient()
  const [editing, setEditing] = useState(false)
  const [calories, setCalories] = useState(goal?.daily_calories.toString() || '2000')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const calorieValue = parseInt(calories)
      if (calorieValue < 500 || calorieValue > 10000) {
        alert('Meta deve estar entre 500 e 10000 calorias')
        return
      }

      if (goal) {
        await supabase
          .from('goals')
          .update({
            daily_calories: calorieValue,
            updated_at: new Date().toISOString()
          })
          .eq('id', goal.id)
      } else {
        await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            daily_calories: calorieValue
          })
      }

      onUpdate()
      setEditing(false)
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
      alert('Erro ao salvar meta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Meta Diária
        </CardTitle>
        <CardDescription>
          Defina sua meta de calorias por dia
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-calories">Calorias por dia</Label>
              <Input
                id="goal-calories"
                type="number"
                min="500"
                max="10000"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false)
                  setCalories(goal?.daily_calories.toString() || '2000')
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-3xl font-bold">
              {goal?.daily_calories || 'Não definida'} {goal && 'kcal'}
            </div>
            <Button onClick={() => setEditing(true)}>
              {goal ? 'Alterar Meta' : 'Definir Meta'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
