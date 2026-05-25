export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper'
export type FastType = '16:8' | '18:6' | '20:4' | '24h' | 'custom'

export interface Meal {
  id: string
  user_id: string
  date: string
  description: string
  calories: number
  meal_type: MealType
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  daily_calories: number
  created_at: string
  updated_at: string
}

export interface Fast {
  id: string
  user_id: string
  start_time: string
  end_time: string | null
  planned_type: FastType
  planned_hours: number | null
  created_at: string
}

export interface DailyStats {
  date: string
  calories: number
  fastingHours: number
}

export interface WeeklyStats {
  daily: DailyStats[]
  avgCalories: number
  totalFasts: number
  avgFastingHours: number
}
