"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function sendMessage(params: { chatRoomId: string; senderProfileId: number; content: string }) {
  try {
    const msg = await prisma.chatMessage.create({
      data: {
        chatRoomId: params.chatRoomId,
        senderId: params.senderProfileId,
        content: params.content,
      },
      include: { sender: true },
    })
    revalidatePath(`/chat/${params.chatRoomId}`)
    return { success: true, message: msg }
  } catch (e) {
    return { success: false, error: "メッセージ送信に失敗しました" }
  }
}

export async function getRoomMessages(chatRoomId: string) {
  return prisma.chatMessage.findMany({
    where: { chatRoomId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  })
}
