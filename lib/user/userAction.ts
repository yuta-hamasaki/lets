"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type CreateProfileInput = {
  userId: string
  email?: string
  nickname: string
  fullname: string
  university: string
  faculty: string
  grade: string
  desc: string
  hobbies?: string
  skills?: string
  portfolioUrl?: string
}


export async function getProfile(userId?: string) {
  if (!userId) return null

  return prisma.profile.findUnique({
    where: { userId }, // ここは userId が確実に string の時だけ実行される
    include: { snsLinks: true },
  })
}

export async function createProfile(input: CreateProfileInput) {
  try {
    if (!input.userId) {
      return { success: false, error: "認証が必要です" }
    }

    // バリデーション
    if (!input.nickname || input.nickname.trim() === "") {
      return { success: false, error: "ニックネームは必須です" }
    }
    if (!input.fullname || input.fullname.trim() === "") {
      return { success: false, error: "氏名は必須です" }
    }
    if (!input.university || input.university.trim() === "") {
      return { success: false, error: "大学名は必須です" }
    }
    if (!input.faculty || input.faculty.trim() === "") {
      return { success: false, error: "学部名は必須です" }
    }
    if (!input.grade || input.grade.trim() === "") {
      return { success: false, error: "学年は必須です" }
    }
    if (!input.desc || input.desc.trim() === "") {
      return { success: false, error: "自己紹介は必須です" }
    }

    const email = input.email ?? `${input.userId}@lets.local`
    const data = {
      nickname: input.nickname.trim(),
      fullname: input.fullname.trim(),
      university: input.university.trim(),
      faculty: input.faculty.trim(),
      grade: input.grade.trim(),
      desc: input.desc.trim(),
      hobbies: input.hobbies?.trim() || null,
      skills: input.skills?.trim() || null,
      portfolioUrl: input.portfolioUrl?.trim() || null,
    }

    const existing = await prisma.profile.findUnique({
      where: { userId: input.userId },
    })

    let profile
    if (existing) {
      profile = await prisma.profile.update({
        where: { userId: input.userId },
        data,
      })
    } else {
      const emailTaken = await prisma.profile.findUnique({
        where: { email },
      })
      if (emailTaken) {
        return { success: false, error: "このメールアドレスは既に使用されています" }
      }
      profile = await prisma.profile.create({
        data: {
          userId: input.userId,
          email,
          ...data,
        },
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/profile")
    return { success: true, profile }
  } catch (e: any) {
    console.error("createProfile error:", e)

    if (e.code === "P2002") {
      const msg = String(e.message || "")
      if (msg.includes("email") || e.meta?.target?.includes?.("email")) {
        return { success: false, error: "このメールアドレスは既に使用されています" }
      }
      if (msg.includes("userId") || e.meta?.target?.includes?.("userId")) {
        return { success: false, error: "このユーザーIDは既に使用されています" }
      }
      return { success: false, error: "入力した情報は既に使用されています。メールアドレス・ユーザーIDをご確認ください。" }
    }

    return { success: false, error: e?.message ?? "プロフィールの作成に失敗しました" }
  }
}
