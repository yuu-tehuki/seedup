'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Project } from '@/lib/types'
import { deleteProject } from '@/app/projects/actions'

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(Math.round((current / goal) * 100), 100)
  return (
    <div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{pct}% 達成</span>
        <span>目標 ¥{goal.toLocaleString()}</span>
      </div>
    </div>
  )
}

function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const STATUS_LABEL: Record<string, string> = {
  active: '募集中',
  successful: '成功',
  closed: '終了',
  draft: '下書き',
}
const STATUS_CLASS: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  successful: 'bg-blue-50 text-blue-700',
  closed: 'bg-gray-100 text-gray-500',
  draft: 'bg-gray-100 text-gray-500',
}

export default function ProjectCard({ project }: { project: Project }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`「${project.title}」を削除しますか？\nこの操作は取り消せません。`)) return
    setDeleting(true)
    const result = await deleteProject(project.id)
    if (result?.error) {
      alert(result.error)
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* クリッカブルなメインエリア */}
      <Link href={`/projects/${project.id}`} className="flex gap-4 p-5 hover:bg-gray-50 transition-colors block">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            '🌱'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${STATUS_CLASS[project.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_LABEL[project.status] ?? project.status}
            </span>
          </div>
          <ProgressBar current={project.current_amount} goal={project.goal_amount} />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>¥{project.current_amount.toLocaleString()} 支援済み</span>
            <span>残り {daysLeft(project.deadline)} 日</span>
          </div>
        </div>
      </Link>

      {/* アクションボタン */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
        <Link
          href={`/projects/${project.id}/edit`}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          編集
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {deleting ? '削除中...' : '削除'}
        </button>
      </div>
    </div>
  )
}
