import { NextRequest, NextResponse } from "next/server";
import { getStackServerApp } from "@/lib/stack";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const app = getStackServerApp();
    const user = await app.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
    }
    
    // 関連するデータベースのレコードを削除
    await prisma.profile.deleteMany({ where: { userId: user.id } });
    
    // ユーザーのアカウント削除
    await user.delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("アカウント削除中にエラーが発生しました:", error);
    return NextResponse.json({ error: "アカウント削除中にエラーが発生しました" }, { status: 500 });
  }
}
