"use server"

import { prisma } from "@/lib/prisma"

export async function getCircles(category?: string) {
  return prisma.circle.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" },
  })
}
