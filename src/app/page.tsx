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

const SUPPORTER_BENEFITS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '少額から始められる',
    description: '1,000円からでもOK。気軽に気になる起業家を応援し、ポートフォリオを分散できます。',
    tag: '1,000円〜',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: '成功したら売上の一部がリターンに',
    description: '事業が成長すれば売上の一部が支援額に応じて毎年還元。応援がそのまま投資になります。',
    tag: '収益連動型リターン',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: '起業家の成長をリアルタイムで見届けられる',
    description: '定期的な進捗報告で、支援したプロジェクトの今がわかります。成長を一緒に喜べます。',
    tag: '進捗報告あり',
  },
]

const SAFETY_FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: '本人確認済みの起業家のみ掲載',
    description: '掲載されるプロジェクトはすべて審査を通過した起業家によるもの。なりすましや詐欺リスクを排除します。',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: '進捗報告の義務化',
    description: '起業家は定期的に進捗を報告する義務があります。資金の使途や事業状況を透明に保ちます。',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'エスクロー方式で資金を保護',
    description: '支援金は目標達成まで第三者機関が保管。目標未達の場合は全額返金されるため安心です。',
  },
]

const ENTREPRENEUR_BENEFITS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: '銀行融資不要・経営権を渡さない',
    description: '株式を渡さず、担保も不要。自分のビジョンで経営しながら必要な資金を集められます。',
    tag: '株式非希薄化',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: '売上が出たときだけ返還',
    description: '固定の返済義務はゼロ。事業が軌道に乗ってから、売上の一部を少しずつ還元する仕組みです。',
    tag: '売上連動型',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: '応援者がそのまま最初のユーザーに',
    description: '資金調達と同時に熱狂的なファンが集まります。応援者はプロダクトの初期ユーザー・口コミ源になります。',
    tag: 'コミュニティ形成',
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
      {/* ① ヒーローセクション */}
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
          <p className="text-xl text-gray-600 mb-3 max-w-2xl mx-auto">
            起業家は夢を資金に変え、応援者は想いを投資に変える。
          </p>
          <p className="text-base text-gray-500 mb-10 max-w-xl mx-auto">
            Seedupは、挑戦する人と信じる人をつなぐクラウドファンディングプラットフォームです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects/new"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              起業家として始める
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold px-8 py-3.5 rounded-xl transition-colors bg-white/70 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
              応援者として始める
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

      {/* ② 応援者向けメリットセクション */}
      <section className="py-20" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">For Supporters</p>
            <h2 className="text-3xl font-bold text-gray-900">応援が、投資になる</h2>
            <p className="text-base text-gray-500 mt-3 max-w-lg mx-auto">
              共感したアイデアを応援するだけで、成長の恩恵を受け取れます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUPPORTER_BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-8 shadow-sm border border-green-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-5">
                  {b.icon}
                </div>
                <div className="mb-3">
                  <span className="text-xs bg-green-600 text-white px-2.5 py-0.5 rounded-full font-medium">
                    {b.tag}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-sm"
            >
              プロジェクトを探す
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ④ 起業家向けメリットセクション */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">For Entrepreneurs</p>
            <h2 className="text-3xl font-bold text-gray-900">アイデア段階から資金調達</h2>
            <p className="text-base text-gray-500 mt-3 max-w-lg mx-auto">
              銀行融資でも株式希薄化でもない、新しい資金調達のかたち。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ENTREPRENEUR_BENEFITS.map((b) => (
              <div key={b.title} className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-5">
                  {b.icon}
                </div>
                <div className="mb-3">
                  <span className="text-xs bg-gray-800 text-white px-2.5 py-0.5 rounded-full font-medium">
                    {b.tag}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              プロジェクトを投稿する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ③ 安心・安全セクション */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">Safety & Trust</p>
            <h2 className="text-3xl font-bold text-gray-900">安心して応援できる仕組み</h2>
            <p className="text-base text-gray-500 mt-3 max-w-lg mx-auto">
              Seedupは応援者・起業家の双方が信頼できるプラットフォームを目指しています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAFETY_FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col gap-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 注目プロジェクトセクション */}
      <section className="bg-white py-20">
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
