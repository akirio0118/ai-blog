import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: 'AI活用マガジンについての説明ページです。',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">このサイトについて</h1>
      <div className="prose prose-gray max-w-none">
        <p>
          <strong>AI活用マガジン</strong>は、ChatGPT・Claude・Geminiなど最新AIツールの使い方・比較・活用術を解説するメディアです。
        </p>
        <h2>このサイトが役立つ人</h2>
        <ul>
          <li>AIツールを使ってみたいが何から始めれば良いか分からない方</li>
          <li>ChatGPTとClaudeの違いを知りたい方</li>
          <li>AIを使って仕事や副業を効率化したい方</li>
          <li>最新AIトレンドをキャッチアップしたい方</li>
        </ul>
        <h2>免責事項・アフィリエイトについて</h2>
        <p>
          当サイトはAmazonアソシエイトプログラムをはじめとするアフィリエイト広告を掲載しています。
          記事内のリンクから商品・サービスを購入された場合、当サイトに報酬が発生することがありますが、
          推奨内容は広告費に左右されません。
        </p>
      </div>
    </div>
  )
}
