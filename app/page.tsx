import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI活用マガジン</h1>
        <p className="text-gray-600">ChatGPT・Claude・Geminiなど最新AIツールの使い方・比較・活用術を解説</p>
      </div>

      {/* アドセンス枠（承認後にコードを貼る） */}
      <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm mb-10">
        広告スペース
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">記事を準備中です...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
