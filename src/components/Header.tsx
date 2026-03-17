import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import NotificationBell from './NotificationBell'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? null
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-600 tracking-tight">
          Seedup
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {/* モバイルでは非表示 */}
          <Link href="/projects" className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900 transition-colors">
            プロジェクト一覧
          </Link>

          {user ? (
            <>
              {/* 起業家 or 未設定: 投稿するボタン */}
              {role !== 'supporter' && (
                <Link
                  href="/projects/new"
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors"
                >
                  投稿する
                </Link>
              )}
              {/* 応援者: プロジェクトを探すボタン */}
              {role === 'supporter' && (
                <Link
                  href="/projects"
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors"
                >
                  <span className="sm:hidden">探す</span>
                  <span className="hidden sm:inline">プロジェクトを探す</span>
                </Link>
              )}
              {/* マイページ: 常に表示 */}
              <Link href="/mypage" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                マイページ
              </Link>
              {/* 通知ベル: 常に表示 */}
              <NotificationBell userId={user.id} />
              {/* ログアウト: モバイルでは非表示 */}
              <form action={logout} className="hidden sm:block">
                <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900 transition-colors">
                ログイン
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors"
              >
                新規登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
