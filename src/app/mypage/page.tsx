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

  const backedProjectIds = [
    ...new Set(
      ((myPledges ?? []) as any[])
        .map((p) => p.projects?.id as string)
        .filter(Boolean)
    ),
  ]

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

  const latestReports: Record<string, Report> = {}
  for (const report of (allReports ?? []) as Report[]) {
    if (!latestReports[report.project_id]) {
      latestReports[report.project_id] = report
    }
  }

  const unreadProjectIds = ((unreadNotifs ?? []) as { link: string }[])
    .map((n) => n.link.match(/\/projects\/([a-f0-9-]+)/)?.[1] ?? null)
    .filter((id): id is string => id !== null)

  const p = profile as Profile | null
  const role = p?.role ?? null
  const isEntrepreneur = role === 'entrepreneur' || role === null  // null = 旧ユーザーは起業家扱い
  const isSupporter = role === 'supporter'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

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
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{p?.display_name ?? '（名前未設定）'}</h1>
              {p?.role === 'entrepreneur' && (
                <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  起業家
                </span>
              )}
              {p?.role === 'supporter' && (
                <span className="shrink-0 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  応援者
                </span>
              )}
            </div>
            <span className="text-xs text-green-600 font-medium group-hover:underline shrink-0">編集する →</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          {p?.bio && <p className="text-sm text-gray-700 mt-2 line-clamp-2">{p.bio}</p>}
          <p className="text-xs text-gray-400 mt-2">
            登録日: {new Date(p?.created_at ?? user.created_at).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </Link>

      {/* ===== 起業家向けCTA ===== */}
      {isEntrepreneur && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">Next Step</p>
              <h2 className="text-white text-xl font-bold">新しいプロジェクトを始めよう</h2>
              <p className="text-green-100 text-sm mt-1">
                アイデアを形にして、応援者を集めましょう。
              </p>
            </div>
            <Link
              href="/projects/new"
              className="shrink-0 bg-white text-green-700 hover:bg-green-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              プロジェクトを投稿する
            </Link>
          </div>
        </div>
      )}

      {/* ===== 応援者向けCTA ===== */}
      {isSupporter && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Discover</p>
              <h2 className="text-white text-xl font-bold">気になるプロジェクトを探そう</h2>
              <p className="text-blue-100 text-sm mt-1">
                共感した起業家を応援して、成長を一緒に見届けよう。
              </p>
            </div>
            <Link
              href="/projects"
              className="shrink-0 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              プロジェクトを探す
            </Link>
          </div>
        </div>
      )}

      {/* ===== 起業家: 投稿したプロジェクト（メインセクション） ===== */}
      {isEntrepreneur && (
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
      )}

      {/* ===== 応援者: 応援中のプロジェクト（メインセクション） ===== */}
      {isSupporter && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold">応援中のプロジェクト</h2>
            {myPledges && myPledges.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
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
      )}

      {/* ===== role未設定（旧ユーザー）: 両方表示 ===== */}
      {role === null && (
        <>
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
        </>
      )}

    </div>
  )
}
