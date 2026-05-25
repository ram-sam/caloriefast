export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      goals: {
        Row: {
          id: string
          user_id: string
          daily_calories: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_calories: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_calories?: number
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          date: string
          description: string
          calories: number
          meal_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          description: string
          calories: number
          meal_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          description?: string
          calories?: number
          meal_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      fasts: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          planned_type: string
          planned_hours: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time?: string | null
          planned_type: string
          planned_hours?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          planned_type?: string
          planned_hours?: number | null
          created_at?: string
        }
      }
    }
  }
}
