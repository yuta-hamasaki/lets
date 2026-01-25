"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function requestFriend(params: { requesterProfileId: number; addresseeProfileId: number }) {
  try {
    const fr = await prisma.friendship.create({
      data: {
        requesterId: params.requesterProfileId,
        addresseeId: params.addresseeProfileId,
        status: "PENDING",
      },
    })
    revalidatePath("/dashboard")
    return { success: true, friendship: fr }
  } catch (e) {
    return { success: false }
  }
}

export async function acceptFriend(params: { friendshipId: string }) {
  try {
    await prisma.friendship.update({
      where: { id: params.friendshipId },
      data: { status: "ACCEPTED" },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    return { success: false }
  }
}
