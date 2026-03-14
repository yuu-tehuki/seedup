import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Project, Update } from '@/lib/types'
import PledgeForm from './PledgeForm'

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(Math.round((current / goal) * 100), 100)
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-1">
        <span className="text-green-600">{pct}% 達成</span>
        <span className="text-gray-500">目標 ¥{goal.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: { user } }, { data: updates }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, profiles(display_name)')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
    supabase
      .from('updates')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!project) notFound()

  const p = project as Project
  const isOwner = user?.id === p.owner_id
  const remaining = daysLeft(p.deadline)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* サムネイル */}
          <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-6xl overflow-hidden">
            {p.thumbnail_url ? (
              <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              '🌱'
            )}
          </div>

          {/* タイトル・メタ情報 */}
          <div>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {p.category}
            </span>
            <h1 className="text-3xl font-bold mt-3 mb-2">{p.title}</h1>
            <p className="text-sm text-gray-500">
              by{' '}
              <span className="font-medium text-gray-700">
                {(p.profiles as any)?.display_name ?? '匿名'}
              </span>
            </p>
          </div>

          {/* 説明 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-3">プロジェクト概要</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{p.description}</p>
          </div>

          {/* 進捗報告 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">進捗報告</h2>
              {isOwner && (
                <a
                  href={`/projects/${p.id}/updates/new`}
                  className="text-sm text-green-600 hover:underline"
                >
                  + 報告を投稿
                </a>
              )}
            </div>
            {!updates || updates.length === 0 ? (
              <p className="text-gray-400 text-sm">まだ進捗報告はありません</p>
            ) : (
              <div className="space-y-4">
                {(updates as Update[]).map((u) => (
                  <div key={u.id} className="border-l-2 border-green-400 pl-4">
                    <p className="font-medium text-sm">{u.title}</p>
                    <p className="text-xs text-gray-400 mb-1">
                      {new Date(u.created_at).toLocaleDateString('ja-JP')}
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{u.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <div className="mb-5">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                ¥{p.current_amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">支援総額</p>
              <ProgressBar current={p.current_amount} goal={p.goal_amount} />
            </div>

            <div className="flex gap-4 text-center py-4 border-y border-gray-100 mb-5">
              <div className="flex-1">
                <p className="text-xl font-bold">{remaining}</p>
                <p className="text-xs text-gray-500">残り日数</p>
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold">
                  {Math.round((p.current_amount / p.goal_amount) * 100)}%
                </p>
                <p className="text-xs text-gray-500">達成率</p>
              </div>
            </div>

            {remaining > 0 && p.status === 'active' ? (
              user ? (
                isOwner ? (
                  <p className="text-center text-sm text-gray-400">
                    自分のプロジェクトには支援できません
                  </p>
                ) : (
                  <PledgeForm projectId={p.id} />
                )
              ) : (
                <a
                  href="/login"
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  ログインして支援する
                </a>
              )
            ) : (
              <p className="text-center text-sm text-gray-400 py-2">このプロジェクトは終了しました</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
