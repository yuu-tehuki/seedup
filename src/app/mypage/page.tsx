import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Project, Profile, Report } from '@/lib/types'
import ProjectCard from './ProjectCard'
import SupporterDashboard from './SupporterDashboard'

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: myProjects }, { data: myPledges }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('pledges')
      .select('*, projects(id, title, current_amount, goal_amount, status, deadline, category, thumbnail_url, revenue_share_rate, return_period_years, return_cap_multiplier)')
      .eq('backer_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  // 支援済みプロジェクトIDを重複なしで取得
  const backedProjectIds = [
    ...new Set(
      ((myPledges ?? []) as any[])
        .map((p) => p.projects?.id as string)
        .filter(Boolean)
    ),
  ]

  // 各プロジェクトの最新進捗報告 + 未読通知を並行取得
  const [{ data: allReports }, { data: unreadNotifs }] = await Promise.all([
    backedProjectIds.length > 0
      ? supabase
          .from('reports')
          .select('*')
          .in('project_id', backedProjectIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as Report[] }),
    supabase
      .from('notifications')
      .select('link')
      .eq('user_id', user.id)
      .eq('is_read', false),
  ])

  // project_id ごとに最新1件だけ保持
  const latestReports: Record<string, Report> = {}
  for (const report of (allReports ?? []) as Report[]) {
    if (!latestReports[report.project_id]) {
      latestReports[report.project_id] = report
    }
  }

  // 未読通知のリンクからプロジェクトIDを抽出
  const unreadProjectIds = ((unreadNotifs ?? []) as { link: string }[])
    .map((n) => n.link.match(/\/projects\/([a-f0-9-]+)/)?.[1] ?? null)
    .filter((id): id is string => id !== null)

  const p = profile as Profile | null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* プロフィール */}
      <Link
        href="/mypage/edit"
        className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-5 hover:shadow-md transition-shadow group block"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-600 shrink-0">
          {p?.display_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-gray-900">{p?.display_name ?? '（名前未設定）'}</h1>
            <span className="text-xs text-green-600 font-medium group-hover:underline shrink-0">編集する →</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          {p?.bio && <p className="text-sm text-gray-700 mt-2 line-clamp-2">{p.bio}</p>}
          <p className="text-xs text-gray-400 mt-2">
            登録日: {new Date(p?.created_at ?? user.created_at).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </Link>

      {/* 自分のプロジェクト */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">投稿したプロジェクト</h2>
          <Link
            href="/projects/new"
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            新規投稿
          </Link>
        </div>

        {!myProjects || myProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
            <p className="mb-3">まだプロジェクトがありません</p>
            <Link href="/projects/new" className="text-green-600 hover:underline text-sm">
              最初のプロジェクトを投稿する
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {(myProjects as Project[]).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 応援者ダッシュボード */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold">応援中のプロジェクト</h2>
          {myPledges && myPledges.length > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">
              {myPledges.length}件
            </span>
          )}
          {unreadProjectIds.length > 0 && (
            <span className="text-xs bg-red-500 text-white px-2.5 py-0.5 rounded-full font-bold">
              {unreadProjectIds.length}件の新着
            </span>
          )}
        </div>

        <SupporterDashboard
          pledges={(myPledges ?? []) as any}
          latestReports={latestReports}
          unreadProjectIds={unreadProjectIds}
        />
      </section>
    </div>
  )
}
