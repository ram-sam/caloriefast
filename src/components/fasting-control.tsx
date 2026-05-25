"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Timer, Play, StopCircle } from "lucide-react"
import { calculateDuration, formatDuration, getFastTypeHours } from "@/lib/utils"
import type { Fast, FastType } from "@/types"

interface FastingControlProps {
  activeFast: Fast | null
  onUpdate: () => void
}

export function FastingControl({ activeFast, onUpdate }: FastingControlProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fastType, setFastType] = useState<FastType>('16:8')
  const [customHours, setCustomHours] = useState('16')
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!activeFast) return

    const updateElapsed = () => {
      const duration = calculateDuration(activeFast.start_time, new Date().toISOString())
      setElapsedTime(duration)
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [activeFast])

  const handleStartFast = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const plannedHours = fastType === 'custom' 
        ? parseInt(customHours) 
        : getFastTypeHours(fastType)

      await supabase
        .from('fasts')
        .insert({
          user_id: user.id,
          start_time: new Date().toISOString(),
          planned_type: fastType,
          planned_hours: plannedHours
        })

      onUpdate()
    } catch (error) {
      console.error('Erro ao iniciar jejum:', error)
      alert('Erro ao iniciar jejum')
    } finally {
      setLoading(false)
    }
  }

  const handleEndFast = async () => {
    if (!activeFast) return

    setLoading(true)
    try {
      await supabase
        .from('fasts')
        .update({
          end_time: new Date().toISOString()
        })
        .eq('id', activeFast.id)

      onUpdate()
    } catch (error) {
      console.error('Erro ao encerrar jejum:', error)
      alert('Erro ao encerrar jejum')
    } finally {
      setLoading(false)
    }
  }

  const fastTypes: { value: FastType; label: string }[] = [
    { value: '16:8', label: '16:8 (16 horas)' },
    { value: '18:6', label: '18:6 (18 horas)' },
    { value: '20:4', label: '20:4 (20 horas)' },
    { value: '24h', label: '24 horas' },
    { value: 'custom', label: 'Personalizado' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Controle de Jejum
        </CardTitle>
        <CardDescription>
          Inicie e acompanhe seu jejum intermitente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeFast ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Jejum {activeFast.planned_type} em andamento
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatDuration(elapsedTime)}
              </div>
              {activeFast.planned_hours && (
                <div className="text-sm text-muted-foreground mt-2">
                  Meta: {activeFast.planned_hours}h
                </div>
              )}
              <div className="mt-4">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all"
                    style={{
                      width: `${Math.min((elapsedTime / (activeFast.planned_hours || 16)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleEndFast}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              {loading ? 'Encerrando...' : 'Encerrar Jejum'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Jejum</Label>
              <Select
                value={fastType}
                onValueChange={(value) => setFastType(value as FastType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fastTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fastType === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-hours">Horas planejadas</Label>
                <Input
                  id="custom-hours"
                  type="number"
                  min="1"
                  max="48"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleStartFast} disabled={loading} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              {loading ? 'Iniciando...' : 'Iniciar Jejum'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
