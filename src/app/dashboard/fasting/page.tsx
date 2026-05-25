'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getFastingHistory } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Fasting } from '@/types'
import Link from 'next/link'

export default function FastingPage() {
  const [user, setUser] = useState<any>(null)
  const [fastings, setFastings] = useState<Fasting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const history = await getFastingHistory(currentUser.uid)
        setFastings(history)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const completedFastings = fastings.filter((f) => f.endTime)
  const averageDuration = completedFastings.length > 0
    ? completedFastings.reduce((sum, f) => sum + (f.duration || 0), 0) / completedFastings.length
    : 0

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Histórico de Jejuns</h1>
        <Link href="/dashboard">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Concluído</p>
          <p className="text-3xl font-bold">{completedFastings.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Média de Duração</p>
          <p className="text-3xl font-bold">{averageDuration.toFixed(1)}h</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Jejuns</p>
          <p className="text-3xl font-bold">{fastings.length}</p>
        </Card>
      </div>

      {fastings.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Nenhum jejum registrado</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {fastings.map((fasting) => (
            <Card key={fasting.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{fasting.type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Início: {new Date(fasting.startTime).toLocaleString('pt-BR')}
                  </p>
                  {fasting.endTime && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Fim: {new Date(fasting.endTime).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {fasting.duration && (
                    <p className="text-2xl font-bold text-green-600">{fasting.duration.toFixed(1)}h</p>
                  )}
                  {!fasting.endTime && (
                    <p className="text-sm text-yellow-600 font-semibold">Em andamento</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
