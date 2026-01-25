"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// CirclePost は schema 上 tags/category/university がないので、まずは content だけ。
export async function createCirclePost(params: {
  authorProfileId: number
  circleId: string
  content: string
}) {
  try {
    const post = await prisma.circlePost.create({
      data: {
        authorId: params.authorProfileId,
        circleId: params.circleId,
        content: params.content,
      },
      include: {
        author: true,
        likes: true,
        replies: true,
      },
    })
    revalidatePath("/dashboard")
    return { success: true, post }
  } catch (e) {
    console.error("createCirclePost failed:", e)
    return { success: false, error: "投稿に失敗しました" }
  }
}

export async function getCirclePosts(circleId: string) {
  return prisma.circlePost.findMany({
    where: { circleId },
    include: {
      author: true,
      likes: true,
      replies: { include: { author: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function likePost(params: { userProfileId: number; postId: string }) {
  try {
    await prisma.postLike.create({
      data: { userId: params.userProfileId, postId: params.postId },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    // unique制約で既にLike済みの可能性もあるので握ってOK
    return { success: false }
  }
}

export async function replyPost(params: { authorProfileId: number; postId: string; content: string }) {
  try {
    const reply = await prisma.postReply.create({
      data: { authorId: params.authorProfileId, postId: params.postId, content: params.content },
      include: { author: true },
    })
    revalidatePath("/dashboard")
    return { success: true, reply }
  } catch (e) {
    return { success: false, error: "返信に失敗しました" }
  }
}
