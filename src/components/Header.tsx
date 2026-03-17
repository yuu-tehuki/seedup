import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import NotificationBell from './NotificationBell'
import MobileMenu from './MobileMenu'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: string | null = null
  let displayName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
    displayName = profile?.display_name ?? null
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-600 tracking-tight">
          Seedup
        </Link>

        {/* ── デスクトップ ナビ（sm以上） ── */}
        <nav className="hidden sm:flex items-center gap-4">
          <Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            プロジェクト一覧
          </Link>

          {user ? (
            <>
              {role !== 'supporter' && (
                <Link
                  href="/projects/new"
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  投稿する
                </Link>
              )}
              {role === 'supporter' && (
                <Link
                  href="/projects"
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  プロジェクトを探す
                </Link>
              )}
              <Link href="/mypage" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                マイページ
              </Link>
              <NotificationBell userId={user.id} />
              <form action={logout}>
                <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                ログイン
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                新規登録
              </Link>
            </>
          )}
        </nav>

        {/* ── モバイル ナビ（sm未満） ── */}
        <div className="flex sm:hidden items-center gap-1">
          {user && <NotificationBell userId={user.id} />}
          {user && (
            <Link
              href="/mypage"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="マイページ"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
          <MobileMenu
            user={user ? { id: user.id, email: user.email ?? '' } : null}
            role={role}
            displayName={displayName}
          />
        </div>
      </div>
    </header>
  )
}
