import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const posts = await prisma.circlePost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: true, // Profile
      likes: true,
      replies: true,
      circle: true,
    },
  })

  // PostCard が欲しい形に整形して返す
  const shaped = posts.map((p) => ({
    id: p.id,
    authorId: p.author.userId,          // 画面遷移で使う string id
    author: p.author.fullname,          // 表示名
    avatar: p.author.avatarUrl ?? null, // 追加した avatarUrl
    timestamp: p.createdAt,
    content: p.content,
    tags: [`#${p.circle.name}`],
    likes: p.likes.length,
    comments: p.replies.length,
  }))

  return NextResponse.json({ posts: shaped })
}
