"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { MealDialog } from "./meal-dialog"
import { getMealTypeLabel, formatDateTime } from "@/lib/utils"
import type { Meal } from "@/types"

interface MealListProps {
  meals: Meal[]
  onUpdate: () => void
}

export function MealList({ meals, onUpdate }: MealListProps) {
  const supabase = createClient()
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta refeição?')) return

    try {
      await supabase.from('meals').delete().eq('id', id)
      onUpdate()
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir refeição')
    }
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
    setShowEditDialog(true)
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma refeição registrada hoje.
        <br />
        Clique em "Nova Refeição" para começar.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {getMealTypeLabel(meal.meal_type)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(meal.date)}
                </span>
              </div>
              <p className="font-medium mt-1">{meal.description}</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                {meal.calories} kcal
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(meal)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(meal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showEditDialog && editingMeal && (
        <MealDialog
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false)
            setEditingMeal(null)
          }}
          onSuccess={() => {
            onUpdate()
            setShowEditDialog(false)
            setEditingMeal(null)
          }}
          meal={editingMeal}
        />
      )}
    </>
  )
}
