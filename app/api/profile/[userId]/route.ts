// app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const id = params.userId

  const isNumeric = /^\d+$/.test(id)

  const profile = await prisma.profile.findUnique({
    where: isNumeric ? { id: Number(id) } : { userId: id },
    include: {
      snsLinks: true,
    },
  })

  if (!profile) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  // 返す形をフロント向けに整形
  const sns = {
    instagram:
      profile.snsLinks.find((l) => l.platform === "INSTAGRAM")?.url ?? null,
    x: profile.snsLinks.find((l) => l.platform === "TWITTER")?.url ?? null,
  }

  // ProfilePage用の形式（profileとpostsを含む）
  // クエリパラメータで形式を切り替え
  const includePosts = req.nextUrl.searchParams.get("includePosts") === "true"
  
  if (includePosts) {
    const posts = await prisma.circlePost.findMany({
      where: { authorId: profile.id },
      include: {
        circle: true,
        likes: true,
        replies: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        name: profile.fullname,
        nickname: profile.nickname,
        university: profile.university,
        faculty: profile.faculty,
        grade: profile.grade,
        title: `${profile.faculty} ${profile.grade}`,
        desc: profile.desc ?? "",
        avatar: profile.avatarUrl ?? null,
        skills: profile.skills,
        hobbies: profile.hobbies,
        snsLinks: profile.snsLinks,
      },
      posts: posts.map((p) => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        circle: p.circle,
        likes: p.likes,
        replies: p.replies,
      })),
    })
  }

  // UserProfileCard用の形式（単一のプロフィールオブジェクト）
  const profileResponse = {
    id: profile.id,
    userId: profile.userId,
    name: profile.fullname,
    nickname: profile.nickname,
    university: profile.university,
    faculty: profile.faculty,
    grade: profile.grade,
    title: `${profile.faculty} ${profile.grade}`,
    desc: profile.desc ?? "",
    avatarUrl: profile.avatarUrl ?? null,
    sns,
    privacySettings: { showUniversity: true, showRealName: true, profilePublic: true },
  }

  return NextResponse.json(profileResponse)
}