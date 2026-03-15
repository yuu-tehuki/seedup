'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project, CATEGORIES } from '@/lib/types'

type Props = {
  project: Project
  action: (formData: FormData) => Promise<{ error: string } | void>
}

export default function EditProjectForm({ project, action }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(project.thumbnail_url)
  const [rateVal, setRateVal] = useState(project.revenue_share_rate)
  const [periodVal, setPeriodVal] = useState(project.return_period_years)
  const [capVal, setCapVal] = useState(project.return_cap_multiplier)
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  return (
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
            onClick={() => {
              setPreview(null)
              ;(document.getElementById('thumbnail-input') as HTMLInputElement).value = ''
            }}
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
          defaultValue={project.title}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          required
          defaultValue={project.category}
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
          defaultValue={project.description}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
          defaultValue={project.goal_amount}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          締め切り日 <span className="text-red-500">*</span>
        </label>
        <input
          name="deadline"
          type="date"
          required
          defaultValue={project.deadline.split('T')[0]}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 起業家情報 */}
      <div className="border-t border-gray-100 pt-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">起業家情報</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">この事業をやる動機</label>
            <textarea
              name="entrepreneur_motivation"
              rows={4}
              defaultValue={project.entrepreneur_motivation ?? ''}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="なぜこの事業に取り組むのか、背景や想いを書いてください"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">これまでの実績・経歴</label>
            <textarea
              name="entrepreneur_track_record"
              rows={4}
              defaultValue={project.entrepreneur_track_record ?? ''}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="過去の仕事・事業・受賞歴・学歴など"
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
                min={1} max={10} step={0.5}
                value={rateVal}
                onChange={(e) => setRateVal(parseFloat(e.target.value))}
                className="flex-1 accent-green-600"
              />
              <span className="w-12 text-sm font-semibold text-gray-800 text-right">{rateVal}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">1〜10%の範囲で設定</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              還元期間 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                name="return_period_years"
                type="range"
                min={1} max={5} step={1}
                value={periodVal}
                onChange={(e) => setPeriodVal(parseInt(e.target.value))}
                className="flex-1 accent-green-600"
              />
              <span className="w-12 text-sm font-semibold text-gray-800 text-right">{periodVal}年</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">1〜5年の範囲で設定</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              リターン上限 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                name="return_cap_multiplier"
                type="range"
                min={1} max={3} step={0.5}
                value={capVal}
                onChange={(e) => setCapVal(parseFloat(e.target.value))}
                className="flex-1 accent-green-600"
              />
              <span className="w-12 text-sm font-semibold text-gray-800 text-right">{capVal}倍</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">1〜3倍の範囲で設定</p>
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
          {loading ? '保存中...' : '変更を保存'}
        </button>
      </div>
    </form>
  )
}
