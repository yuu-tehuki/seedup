'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useRef, useEffect, useState } from 'react'
import { CATEGORIES } from '@/lib/types'

const SORT_OPTIONS = [
  { value: 'newest',       label: '新着順' },
  { value: 'deadline_asc', label: '残り日数：少ない順' },
  { value: 'deadline_desc',label: '残り日数：多い順' },
  { value: 'goal_asc',     label: '目標金額：少ない順' },
  { value: 'goal_desc',    label: '目標金額：多い順' },
  { value: 'rate_desc',    label: '達成率：高い順' },
  { value: 'rate_asc',     label: '達成率：低い順' },
]

export default function ProjectFilters({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentQ        = searchParams.get('q') ?? ''
  const currentCategory = searchParams.get('category') ?? ''
  const currentSort     = searchParams.get('sort') ?? 'newest'

  const [inputValue, setInputValue] = useState(currentQ)

  // URL が変わったら input を同期
  useEffect(() => { setInputValue(currentQ) }, [currentQ])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParams({ q: value }), 400)
  }

  const hasFilter = currentQ || currentCategory || currentSort !== 'newest'

  function clearAll() {
    setInputValue('')
    startTransition(() => router.push(pathname))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* キーワード検索 */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={handleKeywordChange}
            placeholder="プロジェクト名・説明文で検索"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {isPending && (
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          )}
        </div>

        {/* カテゴリ */}
        <select
          value={currentCategory}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
        >
          <option value="">すべてのカテゴリ</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* ソート */}
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="sm:w-52 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* 件数 & クリア */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {isPending ? '検索中...' : `${total} 件のプロジェクト`}
        </p>
        {hasFilter && (
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            フィルターをクリア
          </button>
        )}
      </div>
    </div>
  )
}
