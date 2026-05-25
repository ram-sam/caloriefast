'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Criar Conta</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Comece a acompanhar suas calorias</p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
            Entre aqui
          </Link>
        </p>
      </div>
    </Card>
  )
}
