'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getUserCalories, deleteCalorie } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Calorie } from '@/types'
import Link from 'next/link'

export default function CaloriesPage() {
  const [user, setUser] = useState<any>(null)
  const [calories, setCalories] = useState<Calorie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userCalories = await getUserCalories(currentUser.uid)
        setCalories(userCalories)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredCalories = calories.filter(
    (cal) => cal.date.split('T')[0] === selectedDate
  )
  const totalCalories = filteredCalories.reduce((sum, cal) => sum + cal.calories, 0)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este registro?')) {
      await deleteCalorie(id)
      setCalories(calories.filter((cal) => cal.id !== id))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Histórico de Calorias</h1>
        <Link href="/dashboard">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <Card className="p-6">
        <label className="block text-sm font-medium mb-2">Filtrar por data</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800"
        />
      </Card>

      {filteredCalories.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Nenhum registro para esta data</p>
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <p className="text-lg font-semibold">Total: {totalCalories} calorias</p>
          </Card>

          <div className="space-y-3">
            {filteredCalories.map((calorie) => (
              <Card key={calorie.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{calorie.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(calorie.date).toLocaleTimeString('pt-BR')} - {calorie.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{calorie.calories}</p>
                    <button
                      onClick={() => handleDelete(calorie.id)}
                      className="text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
