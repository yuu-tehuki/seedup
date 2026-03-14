import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* グラデーション背景 */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)',
        }}
      />

      {/* SVG：木の苗イラスト（左下） */}
      <svg
        className="absolute bottom-0 left-8 -z-10 opacity-[0.12]"
        width="220"
        height="300"
        viewBox="0 0 220 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* 幹 */}
        <path d="M110 300 L110 160" stroke="#166534" strokeWidth="10" strokeLinecap="round" />
        {/* 根 */}
        <path d="M110 280 Q85 290 65 285" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M110 280 Q135 292 155 288" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* メインの葉 */}
        <ellipse cx="110" cy="110" rx="55" ry="75" fill="#16a34a" />
        {/* 左の葉 */}
        <ellipse cx="62" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(-20 62 155)" />
        {/* 右の葉 */}
        <ellipse cx="158" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(20 158 155)" />
        {/* 先端の小さい葉 */}
        <ellipse cx="110" cy="48" rx="22" ry="32" fill="#4ade80" />
      </svg>

      {/* SVG：木の苗イラスト（右下・小さめ・反転） */}
      <svg
        className="absolute bottom-0 right-12 -z-10 opacity-[0.08]"
        width="140"
        height="200"
        viewBox="0 0 220 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M110 300 L110 160" stroke="#166534" strokeWidth="10" strokeLinecap="round" />
        <path d="M110 280 Q85 290 65 285" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M110 280 Q135 292 155 288" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="110" cy="110" rx="55" ry="75" fill="#16a34a" />
        <ellipse cx="62" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(-20 62 155)" />
        <ellipse cx="158" cy="155" rx="38" ry="52" fill="#22c55e" transform="rotate(20 158 155)" />
        <ellipse cx="110" cy="48" rx="22" ry="32" fill="#4ade80" />
      </svg>

      {/* 装飾の丸（光の粒） */}
      <div className="absolute top-10 left-1/4 w-48 h-48 rounded-full bg-green-300 opacity-20 blur-3xl -z-10" />
      <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-green-200 opacity-25 blur-3xl -z-10" />

      {/* コンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-24 text-center relative">
        <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-900">
          アイデアに、<span className="text-green-600">最初の一歩</span>を。
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
          Seedupはデジタル系起業家と応援者をつなぐクラウドファンディングプラットフォームです。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/projects"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm"
          >
            プロジェクトを見る
          </Link>
          <Link
            href="/signup"
            className="border border-gray-300 hover:border-gray-400 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </div>
  )
}
