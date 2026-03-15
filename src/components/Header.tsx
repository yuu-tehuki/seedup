import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import NotificationBell from './NotificationBell'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-green-600 tracking-tight">
          Seedup
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            プロジェクト一覧
          </Link>

          {user ? (
            <>
              <Link
                href="/projects/new"
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                投稿する
              </Link>
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
      </div>
    </header>
  )
}
