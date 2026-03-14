'use client'

import { useState } from 'react'

type Props = {
  revenueShareRate: number    // %
  returnPeriodYears: number   // 年
  returnCapMultiplier: number // 倍
}

export default function ReturnSimulator({ revenueShareRate, returnPeriodYears, returnCapMultiplier }: Props) {
  const [amount, setAmount] = useState('')

  const pledgeAmount = parseInt(amount.replace(/,/g, ''), 10)
  const isValid = !isNaN(pledgeAmount) && pledgeAmount > 0

  const cap = isValid ? Math.floor(pledgeAmount * returnCapMultiplier) : 0
  const annualReturn = isValid ? Math.floor(pledgeAmount * (revenueShareRate / 100)) : 0

  // 年ごとの累計リターン（上限キャップ）
  const rows: { year: number; annual: number; cumulative: number; reached: boolean }[] = []
  if (isValid) {
    let cumulative = 0
    for (let year = 1; year <= returnPeriodYears; year++) {
      const remaining = cap - cumulative
      const thisYear = Math.min(annualReturn, remaining)
      cumulative += thisYear
      rows.push({ year, annual: thisYear, cumulative, reached: cumulative >= cap })
      if (cumulative >= cap) break
    }
  }

  const totalReturn = rows.length > 0 ? rows[rows.length - 1].cumulative : 0
  const roi = isValid ? ((totalReturn / pledgeAmount - 1) * 100).toFixed(1) : '0'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-semibold text-lg mb-1">リターンシミュレーター</h2>
      <p className="text-xs text-gray-400 mb-4">支援額を入力すると、還元スケジュールの目安が確認できます。</p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">支援額（円）</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1000}
            step={1000}
            placeholder="100000"
            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {isValid && rows.length > 0 && (
        <>
          {/* サマリー */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-green-600">¥{annualReturn.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">年間還元額</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-green-600">¥{totalReturn.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">総リターン</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-green-600">{Number(roi) >= 0 ? '+' : ''}{roi}%</p>
              <p className="text-xs text-gray-500 mt-0.5">リターン率</p>
            </div>
          </div>

          {/* 年次テーブル */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-4 py-2.5 font-medium">年目</th>
                  <th className="text-right px-4 py-2.5 font-medium">その年の還元</th>
                  <th className="text-right px-4 py-2.5 font-medium">累計還元</th>
                  <th className="text-right px-4 py-2.5 font-medium">進捗</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.year} className={row.reached ? 'bg-green-50' : ''}>
                    <td className="px-4 py-2.5 font-medium text-gray-700">{row.year}年目</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">¥{row.annual.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900">¥{row.cumulative.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min((row.cumulative / cap) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">
                          {Math.min(Math.round((row.cumulative / cap) * 100), 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            ※ 実際の還元額は事業の売上によって変動します。上限は支援額の {returnCapMultiplier} 倍（¥{cap.toLocaleString()}）です。
          </p>
        </>
      )}

      {amount !== '' && !isValid && (
        <p className="text-sm text-red-500">有効な支援額を入力してください</p>
      )}
    </div>
  )
}
