'use client'

import { useState } from 'react'
import Link from 'next/link'

type BackedProject = {
  id: string
  title: string
  current_amount: number
  goal_amount: number
  status: string
  deadline: string
  category: string
  thumbnail_url: string | null
  revenue_share_rate: number
  return_period_years: number
  return_cap_multiplier: number
}

type BackedPledge = {
  id: string
  project_id: string
  backer_id: string
  amount: number
  created_at: string
  projects: BackedProject
}

type LatestReport = {
  id: string
  project_id: string
  title: string
  body: string
  created_at: string
}

type Props = {
  pledges: BackedPledge[]
  latestReports: Record<string, LatestReport>
  unreadProjectIds: string[]
}

function daysLeft(deadline: string): number {
  return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000))
}

function ReturnSimulatorInline({
  pledgeAmount,
  revenueShareRate,
  returnPeriodYears,
  returnCapMultiplier,
}: {
  pledgeAmount: number
  revenueShareRate: number
  returnPeriodYears: number
  returnCapMultiplier: number
}) {
  const [amount, setAmount] = useState(String(pledgeAmount))

  const parsed = parseInt(amount.replace(/,/g, ''), 10)
  const isValid = !isNaN(parsed) && parsed > 0

  const cap = isValid ? Math.floor(parsed * returnCapMultiplier) : 0
  const annualReturn = isValid ? Math.floor(parsed * (revenueShareRate / 100)) : 0

  const rows: { year: number; annual: number; cumulative: number; reached: boolean }[] = []
  if (isValid) {
    let cumulative = 0
    for (let year = 1; year <= returnPeriodYears; year++) {
      const thisYear = Math.min(annualReturn, cap - cumulative)
      cumulative += thisYear
      rows.push({ year, annual: thisYear, cumulative, reached: cumulative >= cap })
      if (cumulative >= cap) break
    }
  }

  const totalReturn = rows.length > 0 ? rows[rows.length - 1].cumulative : 0
  const roi = isValid ? ((totalReturn / parsed - 1) * 100).toFixed(1) : '0'

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">リターンシミュレーション</h4>

      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4 bg-gray-50 rounded-xl p-3">
        <div className="text-center">
          <p className="font-medium text-gray-700">{revenueShareRate}%</p>
          <p>還元率</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-700">{returnPeriodYears}年</p>
          <p>還元期間</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-700">{returnCapMultiplier}倍</p>
          <p>上限倍率</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">シミュレーション額（円）</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1000}
            step={1000}
            className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">実際の支援額: ¥{pledgeAmount.toLocaleString()}</p>
      </div>

      {isValid && rows.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-green-600">¥{annualReturn.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">年間還元額</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-green-600">¥{totalReturn.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">総リターン</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-green-600">{Number(roi) >= 0 ? '+' : ''}{roi}%</p>
              <p className="text-[10px] text-gray-500 mt-0.5">リターン率</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left px-3 py-2 font-medium">年目</th>
                  <th className="text-right px-3 py-2 font-medium">その年の還元</th>
                  <th className="text-right px-3 py-2 font-medium">累計還元</th>
                  <th className="text-right px-3 py-2 font-medium">進捗</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.year} className={row.reached ? 'bg-green-50' : ''}>
                    <td className="px-3 py-2 font-medium text-gray-700">{row.year}年目</td>
                    <td className="px-3 py-2 text-right text-gray-700">¥{row.annual.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">¥{row.cumulative.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-12 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min((row.cumulative / cap) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-7 text-right">
                          {Math.min(Math.round((row.cumulative / cap) * 100), 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
            ※ 実際の還元額は事業の売上によって変動します。上限は支援額の {returnCapMultiplier} 倍（¥{cap.toLocaleString()}）です。
          </p>
        </>
      )}

      {amount !== '' && !isValid && (
        <p className="text-xs text-red-500">有効な金額を入力してください</p>
      )}
    </div>
  )
}

export default function SupporterDashboard({ pledges, latestReports, unreadProjectIds }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const unreadSet = new Set(unreadProjectIds)

  if (pledges.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
        <p className="mb-3">まだ支援したプロジェクトはありません</p>
        <Link href="/projects" className="text-green-600 hover:underline text-sm">
          プロジェクトを探す
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pledges.map((pledge) => {
        const project = pledge.projects
        if (!project) return null

        const achievementRate = project.goal_amount > 0
          ? Math.round((project.current_amount / project.goal_amount) * 100)
          : 0
        const days = daysLeft(project.deadline)
        const hasUnread = unreadSet.has(project.id)
        const latestReport = latestReports[project.id]
        const isExpanded = expandedId === pledge.id

        return (
          <div key={pledge.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* プロジェクト情報 */}
            <Link href={`/projects/${project.id}`} className="flex gap-4 p-5 hover:bg-gray-50 transition-colors block">
              {/* サムネイル */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-green-50 shrink-0 flex items-center justify-center text-3xl">
                {project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  '🌱'
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* カテゴリ・未読バッジ */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {project.category}
                  </span>
                  {hasUnread && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                      新着レポート
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">{project.title}</h3>

                {/* 達成率バー */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-green-600">{achievementRate}% 達成</span>
                    <span>¥{project.current_amount.toLocaleString()} / ¥{project.goal_amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(achievementRate, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 残り日数・支援額 */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>残り <strong className="text-gray-700">{days}</strong> 日</span>
                  <span>支援額 <strong className="text-green-600">¥{pledge.amount.toLocaleString()}</strong></span>
                </div>
              </div>
            </Link>

            {/* 最新進捗報告 */}
            {latestReport && (
              <div className="px-5 pb-4">
                <p className="text-[11px] text-gray-400 font-medium mb-1.5">最新の進捗報告</p>
                <div className="border-l-2 border-green-400 pl-3 py-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-gray-700 line-clamp-1 flex-1">{latestReport.title}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(latestReport.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{latestReport.body}</p>
                </div>
              </div>
            )}

            {/* リターンシミュレーション トグル */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setExpandedId(isExpanded ? null : pledge.id)}
                className="w-full text-xs text-green-600 hover:text-green-700 font-medium py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isExpanded ? 'シミュレーションを閉じる' : 'リターンシミュレーション'}
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <ReturnSimulatorInline
                  pledgeAmount={pledge.amount}
                  revenueShareRate={project.revenue_share_rate}
                  returnPeriodYears={project.return_period_years}
                  returnCapMultiplier={project.return_cap_multiplier}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
