'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, logoutUser } from '@/lib/auth'
import { getDailyGoal, setDailyGoal } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [goal, setGoal] = useState(2000)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userGoal = await getDailyGoal(currentUser.uid)
        setGoal(userGoal || 2000)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSaveGoal = async () => {
    if (user) {
      setSaving(true)
      await setDailyGoal(user.uid, goal)
      setSaving(false)
      toast({ description: 'Meta atualizada com sucesso!' })
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    router.push('/')
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Link href="/dashboard">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Perfil</h2>
        <p className="text-gray-600 dark:text-gray-400">Email: {user?.email}</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Meta Diária de Calorias</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Calorias por dia</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800"
            />
          </div>
          <Button onClick={handleSaveGoal} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">Sair</h2>
        <Button onClick={handleLogout} variant="destructive">
          Fazer Logout
        </Button>
      </Card>
    </div>
  )
}
