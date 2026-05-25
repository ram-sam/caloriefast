'use client'

import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function ResetPasswordPage() {
  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Digite seu email para receber um link</p>
      </div>

      <ResetPasswordForm />

      <div className="mt-6 text-center text-sm">
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
          Voltar ao login
        </Link>
      </div>
    </Card>
  )
}
