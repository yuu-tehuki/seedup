import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types'
import ProjectFilters from './ProjectFilters'

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

function sortProjects(projects: Project[], sort: string): Project[] {
  const arr = [...projects]
  switch (sort) {
    case 'deadline_asc':
      return arr.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    case 'deadline_desc':
      return arr.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
    case 'goal_asc':
      return arr.sort((a, b) => a.goal_amount - b.goal_amount)
    case 'goal_desc':
      return arr.sort((a, b) => b.goal_amount - a.goal_amount)
    case 'rate_desc':
      return arr.sort((a, b) => b.current_amount / b.goal_amount - a.current_amount / a.goal_amount)
    case 'rate_asc':
      return arr.sort((a, b) => a.current_amount / a.goal_amount - b.current_amount / b.goal_amount)
    default: // newest
      return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const { q, category, sort = 'newest' } = await searchParams

  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select('*, profiles(display_name)')
    .eq('status', 'active')

  if (q?.trim()) {
    const escaped = q.trim().replace(/[%_]/g, '\\$&')
    query = query.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`)
  }
  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query
  const projects = sortProjects((data as Project[]) ?? [], sort)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>
        <Link
          href="/projects/new"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          投稿する
        </Link>
      </div>

      {/* フィルターUIは useSearchParams を使うので Suspense でラップが必要 */}
      <Suspense fallback={<div className="h-24 bg-white rounded-2xl border border-gray-200 mb-6 animate-pulse" />}>
        <ProjectFilters total={projects.length} />
      </Suspense>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {q || category ? (
            <>
              <p className="text-lg mb-2">条件に一致するプロジェクトが見つかりませんでした</p>
              <p className="text-sm">検索条件を変えてお試しください</p>
            </>
          ) : (
            <>
              <p className="text-lg mb-4">まだプロジェクトがありません</p>
              <Link href="/projects/new" className="text-green-600 hover:underline">
                最初のプロジェクトを投稿する
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">
                {project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  '🌱'
                )}
              </div>
              <div className="p-5">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {project.category}
                </span>
                <h2 className="font-semibold text-gray-900 mt-2 mb-1 line-clamp-2">{project.title}</h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                <ProgressBar current={project.current_amount} goal={project.goal_amount} />
                <div className="flex justify-between text-xs text-gray-400 mt-3">
                  <span>¥{project.current_amount.toLocaleString()} 支援済み</span>
                  <span>残り {daysLeft(project.deadline)} 日</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
