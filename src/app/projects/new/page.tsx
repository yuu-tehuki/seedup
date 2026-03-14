'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/app/projects/actions'
import { CATEGORIES } from '@/lib/types'

export default function NewProjectPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const minDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await createProject(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">プロジェクトを投稿する</h1>

      <form action={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

        {/* メイン画像 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メイン画像</label>
          <label
            htmlFor="thumbnail-input"
            className="block w-full h-48 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors cursor-pointer overflow-hidden bg-gray-50"
          >
            {preview ? (
              <img src={preview} alt="プレビュー" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">クリックして画像を選択</span>
                <span className="text-xs">JPG・PNG・WebP・GIF / 最大5MB</span>
              </div>
            )}
          </label>
          <input
            id="thumbnail-input"
            name="thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageChange}
          />
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(null); (document.getElementById('thumbnail-input') as HTMLInputElement).value = '' }}
              className="mt-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              画像を削除
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            プロジェクト名 <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            maxLength={100}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="例：AIを使った副業マッチングアプリ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">選択してください</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            プロジェクト説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={6}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="プロジェクトの概要、背景、実現したいことを書いてください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            目標金額（円） <span className="text-red-500">*</span>
          </label>
          <input
            name="goal_amount"
            type="number"
            required
            min={1000}
            step={1000}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="500000"
          />
          <p className="text-xs text-gray-400 mt-1">1,000円以上で設定してください</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            締め切り日 <span className="text-red-500">*</span>
          </label>
          <input
            name="deadline"
            type="date"
            required
            min={minDeadline}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">7日以降の日付を選択してください</p>
        </div>

        {/* 起業家情報 */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">起業家情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                自己紹介
              </label>
              <textarea
                name="bio_hint"
                rows={3}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm resize-none"
                placeholder="自己紹介はマイページのプロフィールから設定できます"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                この事業をやる動機
              </label>
              <textarea
                name="entrepreneur_motivation"
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="なぜこの事業に取り組むのか、背景や想いを書いてください"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                これまでの実績・経歴
              </label>
              <textarea
                name="entrepreneur_track_record"
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="過去の仕事・事業・受賞歴・学歴など、信頼性につながる情報を書いてください"
              />
            </div>
          </div>
        </div>

        {/* リターン条件 */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">リターン条件</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                売上還元率 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  name="revenue_share_rate"
                  type="range"
                  required
                  min={1}
                  max={10}
                  step={0.5}
                  defaultValue={3}
                  className="flex-1 accent-green-600"
                  onInput={(e) => {
                    const el = e.currentTarget
                    el.nextElementSibling!.textContent = `${el.value}%`
                  }}
                />
                <span className="w-12 text-sm font-semibold text-gray-800 text-right">3%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">1〜10%の範囲で設定（売上の何%を支援者に還元するか）</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                還元期間 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  name="return_period_years"
                  type="range"
                  required
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={3}
                  className="flex-1 accent-green-600"
                  onInput={(e) => {
                    const el = e.currentTarget
                    el.nextElementSibling!.textContent = `${el.value}年`
                  }}
                />
                <span className="w-12 text-sm font-semibold text-gray-800 text-right">3年</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">1〜5年の範囲で設定（売上還元を行う期間）</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                リターン上限 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  name="return_cap_multiplier"
                  type="range"
                  required
                  min={1}
                  max={3}
                  step={0.5}
                  defaultValue={2}
                  className="flex-1 accent-green-600"
                  onInput={(e) => {
                    const el = e.currentTarget
                    el.nextElementSibling!.textContent = `${el.value}倍`
                  }}
                />
                <span className="w-12 text-sm font-semibold text-gray-800 text-right">2倍</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">1〜3倍の範囲で設定（支援額に対する還元総額の上限）</p>
            </div>
          </div>
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
            {loading ? '投稿中...' : 'プロジェクトを投稿'}
          </button>
        </div>
      </form>
    </div>
  )
}
