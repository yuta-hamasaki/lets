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
    if (!input.userId) throw new Error("UNAUTHORIZED")
    const email = input.email ?? `${input.userId}@lets.local`

    const created = await prisma.profile.upsert({
      where: { userId: input.userId },
      create: {
        userId: input.userId,
        email,
        nickname: input.nickname,
        fullname: input.fullname,
        university: input.university,
        faculty: input.faculty,
        grade: input.grade,
        desc: input.desc,
        hobbies: input.hobbies ?? null,
        skills: input.skills ?? null,
        portfolioUrl: input.portfolioUrl ?? null,
      },
      update: {
        nickname: input.nickname,
        fullname: input.fullname,
        university: input.university,
        faculty: input.faculty,
        grade: input.grade,
        desc: input.desc,
        hobbies: input.hobbies ?? null,
        skills: input.skills ?? null,
        portfolioUrl: input.portfolioUrl ?? null,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, profile: created }
  } catch (e: any) {
    console.error("createProfile error:", e)
    return { success: false, error: e?.message ?? "CREATE_FAILED" }
  }
}
