import { z } from 'zod'

export const mealSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Máximo 200 caracteres'),
  calories: z.number().min(1, 'Calorias devem ser positivas').max(10000, 'Valor muito alto'),
  meal_type: z.enum(['breakfast', 'lunch', 'snack', 'dinner', 'supper'], {
    required_error: 'Tipo de refeição é obrigatório'
  })
})

export const goalSchema = z.object({
  daily_calories: z.number().min(500, 'Mínimo 500 calorias').max(10000, 'Máximo 10000 calorias')
})

export const fastSchema = z.object({
  planned_type: z.enum(['16:8', '18:6', '20:4', '24h', 'custom'], {
    required_error: 'Tipo de jejum é obrigatório'
  }),
  planned_hours: z.number().min(1).max(48).nullable().optional()
})

export const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export type MealFormData = z.infer<typeof mealSchema>
export type GoalFormData = z.infer<typeof goalSchema>
export type FastFormData = z.infer<typeof fastSchema>
export type AuthFormData = z.infer<typeof authSchema>
