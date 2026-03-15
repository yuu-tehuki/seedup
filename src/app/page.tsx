import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types'

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

const STEPS = [
  {
    number: '01',
    title: '起業家がプロジェクトを投稿',
    description: 'アイデアや事業計画、リターン条件を設定してプロジェクトを公開。応援者に想いを届けます。',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: '02',
    title: '応援者が共感したプロジェクトを支援',
    description: '気になるプロジェクトを見つけたら金額を決めて支援。起業家の挑戦を後押しします。',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: '事業成長で売上の一部がリターンに',
    description: '事業が成長したら売上の一部が支援額に応じて還元されます。応援がそのまま投資になります。',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div>
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)' }}
        />
        <svg className="absolute bottom-0 left-8 -z-10 opacity-[0.12]" width="220" height="300"
          viewBox="0 0 220 300" fill="none" aria-hidden="true">
          <path d="M110 300 L110 160" stroke="#166534" strokeWidth="10" strokeLinecap="round" />
          <path d="M110 280 Q85 290 65 285" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 280 Q135 292 155 288" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="110" cy="110" rx="55" ry="75" fill="#16a34a" />
          <ellipse cx="62" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(-20 62 155)" />
          <ellipse cx="158" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(20 158 155)" />
          <ellipse cx="110" cy="48" rx="22" ry="32" fill="#4ade80" />
        </svg>
        <svg className="absolute bottom-0 right-12 -z-10 opacity-[0.08]" width="140" height="200"
          viewBox="0 0 220 300" fill="none" aria-hidden="true">
          <path d="M110 300 L110 160" stroke="#166534" strokeWidth="10" strokeLinecap="round" />
          <path d="M110 280 Q85 290 65 285" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 280 Q135 292 155 288" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="110" cy="110" rx="55" ry="75" fill="#16a34a" />
          <ellipse cx="62" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(-20 62 155)" />
          <ellipse cx="158" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(20 158 155)" />
          <ellipse cx="110" cy="48" rx="22" ry="32" fill="#4ade80" />
        </svg>
        <div className="absolute top-10 left-1/4 w-48 h-48 rounded-full bg-green-300 opacity-20 blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-green-200 opacity-25 blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-4 py-24 text-center relative">
          <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-900">
            アイデアに、<span className="text-green-600">最初の一歩</span>を。
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Seedupはデジタル系起業家と応援者をつなぐクラウドファンディングプラットフォームです。
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/projects"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm">
              プロジェクトを見る
            </Link>
            <Link href="/signup"
              className="border border-gray-300 hover:border-gray-400 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors">
              無料で始める
            </Link>
          </div>
        </div>
      </div>

      {/* 仕組みセクション */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">3ステップで始める</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* ステップ間の矢印（md以上のみ） */}
            <div className="hidden md:block absolute top-10 left-1/3 -translate-x-1/2 w-16 text-gray-200 text-4xl text-center select-none">→</div>
            <div className="hidden md:block absolute top-10 left-2/3 -translate-x-1/2 w-16 text-gray-200 text-4xl text-center select-none">→</div>

            {STEPS.map((step) => (
              <div key={step.number} className="relative bg-gray-50 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-5">
                  {step.icon}
                </div>
                <div className="absolute top-4 right-5 text-4xl font-black text-gray-100 select-none leading-none">
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 注目プロジェクトセクション */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">Featured</p>
              <h2 className="text-3xl font-bold text-gray-900">注目のプロジェクト</h2>
            </div>
            <Link href="/projects"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
              すべて見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {!projects || projects.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="mb-4">現在公開中のプロジェクトはありません</p>
              <Link href="/projects/new" className="text-green-600 hover:underline text-sm">
                最初のプロジェクトを投稿する
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(projects as Project[]).map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                    <h3 className="font-semibold text-gray-900 mt-2 mb-1 line-clamp-2">{project.title}</h3>
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

          <div className="text-center mt-10">
            <Link href="/projects"
              className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-green-400 hover:text-green-700 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors">
              すべてのプロジェクトを見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
