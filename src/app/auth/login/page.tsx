'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entrar</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Bem-vindo de volta!</p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Não tem conta?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center text-sm">
        <Link href="/auth/reset-password" className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          Esqueceu a senha?
        </Link>
      </div>
    </Card>
  )
}
