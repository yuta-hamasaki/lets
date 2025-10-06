"use server"
import { getStackServerApp } from "@/lib/stack";
import { prisma } from "@/lib/prisma";

export async function getProfile() {
  const app = getStackServerApp();
  const user = await app.getUser();

  if (!user) {
    return null; // 未ログインの場合はnullを返す
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return profile;
}


export async function createProfile(data: {
  nickname: string;
  lastname: string;
  firstname: string;
  fullname: string;
  university: string;
  faculty: string;
  grade: string;
  desc: string;
  hobbies?: string;
  skills?: string;
  portfolioUrl?: string;
}) {
  try {
    const app = getStackServerApp();
    const user = await app.getUser();

    if (!user) {
      return { success: false, error: "ログインが必要です" };
    }

    // 既存のプロフィールチェック
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return { success: false, error: "プロフィールは既に存在します" };
    }

    // プロフィール作成
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        email: user.primaryEmail ?? "", // 追加: emailフィールド
        nickname: data.nickname,
        fullname: data.fullname,
        university: data.university,
        faculty: data.faculty,
        grade: data.grade,
        desc: data.desc,
        hobbies: data.hobbies || null,
        skills: data.skills || null,
        portfolioUrl: data.portfolioUrl || null,
      },
    });

    return { success: true, profile };
  } catch (error) {
    console.error("Profile creation error:", error);
    return { success: false, error: "プロフィールの作成に失敗しました" };
  }
}