"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Meal, MealType } from "@/types"

interface MealDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  meal?: Meal
}

export function MealDialog({ open, onClose, onSuccess, meal }: MealDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: meal?.date.split('T')[0] || new Date().toISOString().split('T')[0],
    description: meal?.description || '',
    calories: meal?.calories.toString() || '',
    meal_type: meal?.meal_type || 'lunch' as MealType
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const mealData = {
        user_id: user.id,
        date: new Date(formData.date).toISOString(),
        description: formData.description,
        calories: parseInt(formData.calories),
        meal_type: formData.meal_type,
        updated_at: new Date().toISOString()
      }

      if (meal) {
        await supabase
          .from('meals')
          .update(mealData)
          .eq('id', meal.id)
      } else {
        await supabase
          .from('meals')
          .insert(mealData)
      }

      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar refeição:', error)
      alert('Erro ao salvar refeição')
    } finally {
      setLoading(false)
    }
  }

  const mealTypes: { value: MealType; label: string }[] = [
    { value: 'breakfast', label: 'Café da manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'snack', label: 'Lanche' },
    { value: 'dinner', label: 'Jantar' },
    { value: 'supper', label: 'Ceia' },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{meal ? 'Editar' : 'Nova'} Refeição</DialogTitle>
            <DialogDescription>
              Preencha os dados da refeição
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal_type">Tipo de Refeição</Label>
              <Select
                value={formData.meal_type}
                onValueChange={(value) => setFormData({ ...formData, meal_type: value as MealType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Arroz, feijão e frango"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calorias (kcal)</Label>
              <Input
                id="calories"
                type="number"
                min="1"
                max="10000"
                placeholder="500"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
