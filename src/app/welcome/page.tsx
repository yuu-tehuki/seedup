import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'

export default async function WelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const p = profile as Profile | null
  const role = p?.role ?? 'entrepreneur'
  const displayName = p?.display_name ?? user.user_metadata?.display_name ?? 'ユーザー'
  const isEntrepreneur = role === 'entrepreneur'

  const accentColor = isEntrepreneur ? 'green' : 'blue'
  const roleLabel = isEntrepreneur ? '起業家' : '応援者'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* カード */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* ヘッダー帯 */}
          <div
            className="px-8 py-10 text-center"
            style={{
              background: isEntrepreneur
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            {/* アバター */}
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 ${isEntrepreneur ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
              {displayName[0]?.toUpperCase() ?? '?'}
            </div>

            <p className="text-white/80 text-sm font-medium mb-1">
              {roleLabel}として登録完了
            </p>
            <h1 className="text-white text-2xl font-bold">
              ようこそSeedupへ！
            </h1>
            <p className="text-white/90 text-base mt-1 font-medium">
              {displayName} さん
            </p>
          </div>

          {/* 本文 */}
          <div className="px-8 py-8 text-center space-y-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              {isEntrepreneur
                ? 'あなたのアイデアを形にしましょう。\n最初のプロジェクトを投稿して、応援者を集めましょう。'
                : 'あなたの応援が起業家の力になります。\n共感できるプロジェクトを探してみましょう。'}
            </p>

            {/* メインCTA */}
            <Link
              href={isEntrepreneur ? '/projects/new' : '/projects'}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base transition-opacity hover:opacity-90 ${isEntrepreneur ? 'bg-green-600' : 'bg-blue-600'}`}
            >
              {isEntrepreneur ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  最初のプロジェクトを投稿する
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  応援できるプロジェクトを探す
                </>
              )}
            </Link>

            {/* スキップ */}
            <Link
              href="/mypage"
              className="block text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              スキップしてマイページへ →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
