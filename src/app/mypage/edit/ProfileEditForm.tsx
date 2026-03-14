'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile } from '@/lib/types'

type Props = {
  profile: Profile
  action: (formData: FormData) => Promise<{ error: string } | void>
}

export default function ProfileEditForm({ profile, action }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await action(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          表示名 <span className="text-red-500">*</span>
        </label>
        <input
          name="display_name"
          type="text"
          required
          maxLength={50}
          defaultValue={profile.display_name}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="例：田中 太郎"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
        <textarea
          name="bio"
          rows={3}
          maxLength={500}
          defaultValue={profile.bio ?? ''}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="あなた自身のことを簡単に教えてください"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">この事業をやる動機</label>
        <textarea
          name="motivation"
          rows={4}
          maxLength={1000}
          defaultValue={profile.motivation ?? ''}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="なぜ起業・この事業に取り組むのか、背景や想いを書いてください"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">これまでの実績・経歴</label>
        <textarea
          name="track_record"
          rows={4}
          maxLength={1000}
          defaultValue={profile.track_record ?? ''}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="過去の仕事・事業・受賞歴・学歴など、信頼性につながる情報を書いてください"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  )
}
