'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'

type Role = 'entrepreneur' | 'supporter'

const ROLES: { value: Role; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'entrepreneur',
    label: '起業家として登録',
    sub: 'アイデアを資金化し、夢を実現する',
    color: 'green',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    value: 'supporter',
    label: '応援者として登録',
    sub: '共感した起業家を支援・投資する',
    color: 'blue',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
    ),
  },
]

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)

    if (!role) {
      setError('役割を選択してください')
      return
    }

    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }

    formData.set('role', role)
    setLoading(true)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-center mb-2">新規登録</h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            アカウントを作成してSeedupを始めよう
          </p>

          {/* 役割選択 */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">どちらで始めますか？</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => {
                const selected = role === r.value
                const isGreen = r.color === 'green'
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                      selected
                        ? isGreen
                          ? 'border-green-500 bg-green-50'
                          : 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {selected && (
                      <span className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${isGreen ? 'bg-green-500' : 'bg-blue-500'}`}>
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    <span className={`${selected ? (isGreen ? 'text-green-600' : 'text-blue-600') : 'text-gray-400'}`}>
                      {r.icon}
                    </span>
                    <span className={`text-xs font-semibold leading-snug ${selected ? (isGreen ? 'text-green-700' : 'text-blue-700') : 'text-gray-700'}`}>
                      {r.label.replace('として登録', '')}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">{r.sub}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                表示名
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="山田 太郎"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="8文字以上"
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード（確認）
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                autoComplete="new-password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !role}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? '登録中...' : role ? `${role === 'entrepreneur' ? '起業家' : '応援者'}として登録する` : '役割を選択してください'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
