'use client'

import { useState } from 'react'
import { createPledge } from '@/app/projects/actions'

export default function PledgeForm({ projectId }: { projectId: string }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const PRESETS = [1000, 3000, 5000, 10000, 30000]

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await createPledge(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setAmount('')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-green-700 font-semibold mb-1">支援ありがとうございます！</p>
        <p className="text-green-600 text-sm">あなたの支援がプロジェクトを前進させます。</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-3 text-sm text-green-600 hover:underline"
        >
          続けて支援する
        </button>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(String(p))}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              amount === String(p)
                ? 'bg-green-600 text-white border-green-600'
                : 'border-gray-300 text-gray-700 hover:border-green-500'
            }`}
          >
            ¥{p.toLocaleString()}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">金額を入力（円）</label>
        <input
          name="amount"
          type="number"
          required
          min={100}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="1000"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? '処理中...' : 'このプロジェクトを支援する'}
      </button>
    </form>
  )
}
