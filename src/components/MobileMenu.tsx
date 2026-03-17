'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'

type Props = {
  user: { id: string; email: string } | null
  role: string | null
  displayName: string | null
}

export default function MobileMenu({ user, role, displayName }: Props) {
  const [open, setOpen] = useState(false)

  // ドロワー開閉時にbodyスクロールを制御
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function close() { setOpen(false) }

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col justify-center gap-[5px] w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors items-center"
        aria-label="メニューを開く"
      >
        <span className="block w-5 h-[2px] bg-gray-600 rounded-full" />
        <span className="block w-5 h-[2px] bg-gray-600 rounded-full" />
        <span className="block w-5 h-[2px] bg-gray-600 rounded-full" />
      </button>

      {/* オーバーレイ + ドロワー */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* 背景暗転 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden="true"
          />

          {/* ドロワー本体 */}
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col">

            {/* ドロワーヘッダー */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
              <span className="font-bold text-green-600 text-lg tracking-tight">Seedup</span>
              <button
                onClick={close}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="メニューを閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ユーザー情報（ログイン時） */}
            {user && (
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayName ?? user.email}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                {role && (
                  <span className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    role === 'entrepreneur'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {role === 'entrepreneur' ? '起業家' : '応援者'}
                  </span>
                )}
              </div>
            )}

            {/* メニュー項目 */}
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">

              <MenuItem href="/projects" onClick={close} icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }>
                プロジェクト一覧
              </MenuItem>

              {user && (
                <>
                  <MenuItem href="/mypage" onClick={close} icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }>
                    マイページ
                  </MenuItem>

                  {role !== 'supporter' && (
                    <MenuItem href="/projects/new" onClick={close} icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      プロジェクトを投稿する
                    </MenuItem>
                  )}

                  {role === 'supporter' && (
                    <MenuItem href="/projects" onClick={close} icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }>
                      プロジェクトを探す
                    </MenuItem>
                  )}
                </>
              )}

              {!user && (
                <>
                  <MenuItem href="/login" onClick={close} icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  }>
                    ログイン
                  </MenuItem>

                  <MenuItem href="/signup" onClick={close} icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  }>
                    新規登録
                  </MenuItem>
                </>
              )}
            </nav>

            {/* ログアウト（ログイン時のみ・下部固定） */}
            {user && (
              <div className="px-3 py-4 border-t border-gray-100 shrink-0">
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    ログアウト
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function MenuItem({
  href,
  onClick,
  icon,
  children,
}: {
  href: string
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
    >
      <span className="text-gray-400 shrink-0">{icon}</span>
      {children}
    </Link>
  )
}
