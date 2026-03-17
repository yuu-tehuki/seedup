'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/app/projects/actions'
import { CATEGORIES } from '@/lib/types'

// ──────────────────────────────────────────────
// カテゴリ別推奨リターン条件
// ──────────────────────────────────────────────
type Range = { min: number; max: number; mid: number }
type Recommendation = {
  label: string           // 推奨テーブル上の分類名
  rate: Range             // 売上還元率 (%)
  years: Range            // 還元期間 (年)
  cap: Range              // 上限倍率 (倍)
}

const RECOMMENDATIONS: Record<string, Recommendation> = {
  'テクノロジー': {
    label: 'テクノロジー',
    rate:  { min: 5,   max: 8,   mid: 6.5 },
    years: { min: 2,   max: 3,   mid: 3   },
    cap:   { min: 2,   max: 2,   mid: 2   },
  },
  'アプリ・SaaS': {
    label: 'SaaS・業務ツール',
    rate:  { min: 5,   max: 8,   mid: 6.5 },
    years: { min: 2,   max: 3,   mid: 3   },
    cap:   { min: 2,   max: 2.5, mid: 2   },
  },
  'AI・機械学習': {
    label: 'AIサービス',
    rate:  { min: 5,   max: 8,   mid: 6.5 },
    years: { min: 2,   max: 3,   mid: 3   },
    cap:   { min: 2,   max: 3,   mid: 2.5 },
  },
  'ゲーム': {
    label: 'アプリ・コンテンツ',
    rate:  { min: 4,   max: 7,   mid: 5.5 },
    years: { min: 2,   max: 4,   mid: 3   },
    cap:   { min: 2,   max: 2,   mid: 2   },
  },
  'クリエイティブ': {
    label: 'アプリ・コンテンツ',
    rate:  { min: 4,   max: 7,   mid: 5.5 },
    years: { min: 2,   max: 4,   mid: 3   },
    cap:   { min: 2,   max: 2,   mid: 2   },
  },
  'ソーシャル': {
    label: 'EC・マーケットプレイス',
    rate:  { min: 3,   max: 5,   mid: 4   },
    years: { min: 3,   max: 4,   mid: 4   },
    cap:   { min: 1.5, max: 2,   mid: 1.5 },
  },
}

// 推奨範囲外かどうか
function outOfRange(value: number, range: Range) {
  return value < range.min || value > range.max
}

export default function NewProjectPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [category, setCategory] = useState('')

  // スライダーの状態（コントロールド）
  const [rate, setRate]   = useState(3)
  const [years, setYears] = useState(3)
  const [cap, setCap]     = useState(2)

  const router = useRouter()
  const rec = RECOMMENDATIONS[category] ?? null

  function applyRecommendation() {
    if (!rec) return
    setRate(rec.rate.mid)
    setYears(rec.years.mid)
    setCap(rec.cap.mid)
  }

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

        {/* カテゴリ（推奨ロジックと連動） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">選択してください</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* 推奨レンジカード */}
          {rec && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-700 mb-2">
                    💡 {rec.label}の推奨リターン条件
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg py-2 px-1 border border-amber-100">
                      <p className="text-xs text-gray-500 mb-0.5">売上還元率</p>
                      <p className="text-sm font-bold text-amber-700">{rec.rate.min}〜{rec.rate.max}%</p>
                    </div>
                    <div className="bg-white rounded-lg py-2 px-1 border border-amber-100">
                      <p className="text-xs text-gray-500 mb-0.5">還元期間</p>
                      <p className="text-sm font-bold text-amber-700">{rec.years.min}〜{rec.years.max}年</p>
                    </div>
                    <div className="bg-white rounded-lg py-2 px-1 border border-amber-100">
                      <p className="text-xs text-gray-500 mb-0.5">上限倍率</p>
                      <p className="text-sm font-bold text-amber-700">
                        {rec.cap.min === rec.cap.max ? `${rec.cap.min}倍` : `${rec.cap.min}〜${rec.cap.max}倍`}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={applyRecommendation}
                  className="shrink-0 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  推奨値を適用
                </button>
              </div>
            </div>
          )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
              <textarea
                name="bio_hint"
                rows={3}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm resize-none"
                placeholder="自己紹介はマイページのプロフィールから設定できます"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">この事業をやる動機</label>
              <textarea
                name="entrepreneur_motivation"
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="なぜこの事業に取り組むのか、背景や想いを書いてください"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">これまでの実績・経歴</label>
              <textarea
                name="entrepreneur_track_record"
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="過去の仕事・事業・受賞歴・学歴など、信頼性につながる情報を書いてください"
              />
            </div>
          </div>
        </div>

        {/* リターン条件（コントロールドスライダー + 推奨連動） */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">リターン条件</h2>
          <div className="space-y-5">

            {/* 売上還元率 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  売上還元率 <span className="text-red-500">*</span>
                </label>
                <span className="text-sm font-bold text-gray-800">{rate}%</span>
              </div>
              <input
                name="revenue_share_rate"
                type="range"
                required
                min={1}
                max={10}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">1〜10%の範囲で設定</p>
                {rec && outOfRange(rate, rec.rate) && (
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    推奨範囲（{rec.rate.min}〜{rec.rate.max}%）から外れています
                  </p>
                )}
              </div>
            </div>

            {/* 還元期間 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  還元期間 <span className="text-red-500">*</span>
                </label>
                <span className="text-sm font-bold text-gray-800">{years}年</span>
              </div>
              <input
                name="return_period_years"
                type="range"
                required
                min={1}
                max={5}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">1〜5年の範囲で設定</p>
                {rec && outOfRange(years, rec.years) && (
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    推奨範囲（{rec.years.min}〜{rec.years.max}年）から外れています
                  </p>
                )}
              </div>
            </div>

            {/* リターン上限 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  リターン上限 <span className="text-red-500">*</span>
                </label>
                <span className="text-sm font-bold text-gray-800">{cap}倍</span>
              </div>
              <input
                name="return_cap_multiplier"
                type="range"
                required
                min={1}
                max={3}
                step={0.5}
                value={cap}
                onChange={(e) => setCap(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">1〜3倍の範囲で設定</p>
                {rec && outOfRange(cap, rec.cap) && (
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    推奨範囲（{rec.cap.min}{rec.cap.min === rec.cap.max ? '' : `〜${rec.cap.max}`}倍）から外れています
                  </p>
                )}
              </div>
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
