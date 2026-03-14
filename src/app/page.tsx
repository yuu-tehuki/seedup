import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6 leading-tight">
        アイデアに、<span className="text-green-600">最初の一歩</span>を。
      </h1>
      <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
        Seedupはデジタル系起業家と応援者をつなぐクラウドファンディングプラットフォームです。
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/projects"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          プロジェクトを見る
        </Link>
        <Link
          href="/signup"
          className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          無料で始める
        </Link>
      </div>
    </div>
  )
}
