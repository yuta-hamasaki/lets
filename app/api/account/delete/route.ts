import { NextRequest, NextResponse } from "next/server";
import { getStackServerApp } from "@/lib/stack"; 


export async function DELETE(request: NextRequest, response: NextResponse) {
  try{
    const app = getStackServerApp();
    const user = await app.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
    }
    
    // ユーザーのアカウント削除
    await user.delete();
    
    // 必要に応じて、関連するデータベースのレコードも削除
    // 例: await prisma.profile.deleteMany({ where: { userId: user.id } });
  }catch(error){
    console.error("アカウント削除中にエラーが発生しました:", error);
    return NextResponse.json({ error: "アカウント削除中にエラーが発生しました" }, { status: 500 });
  }
}
