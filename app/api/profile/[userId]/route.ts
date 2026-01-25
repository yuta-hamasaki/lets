// app/api/profiles/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

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

  return NextResponse.json({
    id: profile.id,
    userId: profile.userId,
    name: profile.fullname,
    nickname: profile.nickname,
    university: profile.university,
    faculty: profile.faculty,
    grade: profile.grade,
    title: `${profile.faculty} ${profile.grade}`,
    desc: profile.desc,
    avatarUrl: null, // ← schemaに追加したら返す
    sns,
    privacySettings: { showUniversity: true, showRealName: true, profilePublic: true }, // ← DB化するなら後で
  })
}