// prisma/seed.ts
import "dotenv/config"
import { PrismaClient, FriendshipStatus, CircleRole, SnsPlatform } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

// 👇 ダミーデータの import パスだけあなたのプロジェクトに合わせて変更
import {
  dummyUsers,
  initialPosts,
  initialConversations,
  initialChatHistories,
  dummyCircles,
} from "./dummyData"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function safeStr(v: any, fallback = ""): string {
  if (v === null || v === undefined) return fallback
  return String(v)
}

function gradeToLabel(year: any) {
  const y = safeStr(year, "1")
  // schema は grade: String なので「3年」みたいに入れる
  return `${y}年`
}

function toEmail(userKey: string) {
  // userId は 's1' みたいな文字列なので、メールはダミー生成
  return `${userKey}@lets.example`
}

function mapSnsPlatform(key: "instagram" | "x"): SnsPlatform {
  if (key === "instagram") return SnsPlatform.INSTAGRAM
  return SnsPlatform.TWITTER
}

async function main() {
  console.log("🌱 Seeding start...")

  // =========
  // 0) （任意）既存データを全消ししたい場合はここを有効化
  // =========
  // await prisma.postLike.deleteMany()
  // await prisma.postReply.deleteMany()
  // await prisma.chatMessage.deleteMany()
  // await prisma.chatRoom.deleteMany()
  // await prisma.circleMembership.deleteMany()
  // await prisma.circlePost.deleteMany()
  // await prisma.friendship.deleteMany()
  // await prisma.snsLink.deleteMany()
  // await prisma.circle.deleteMany()
  // await prisma.profile.deleteMany()

  // =========
  // 1) Profile を作成
  // =========
  const usersArray = Object.entries(dummyUsers) // [key, user]
  // Profile.id は autoincrement なので、まず userId(文字列) をユニークキーにして upsert する
  // ただ createMany だと id が返らないので、後で対応づけるために userId->Profile.id を引く

  // まずは一括 createMany（email と userId は unique なので skipDuplicates）
  await prisma.profile.createMany({
    data: usersArray.map(([key, u]: any) => ({
      userId: u.id, // 例: "user_main", "s1"...
      email: toEmail(u.id),
      nickname: safeStr(u.name).split(" ")[0] ?? safeStr(u.name),
      fullname: safeStr(u.name),
      university: safeStr(u.university),
      faculty: safeStr(u.faculty),
      grade: gradeToLabel(u.year),
      desc: u.title ? safeStr(u.title) : null,
      hobbies: Array.isArray(u.hobbies) ? u.hobbies.join(", ") : (u.hobbies ?? null),
      skills: Array.isArray(u.interests) ? u.interests.join(", ") : (u.skills ?? null),
      portfolioUrl: u.portfolioUrl ?? null,
    })),
    skipDuplicates: true,
  })

  // Profile の id を引けるように map を作る
  const profiles = await prisma.profile.findMany({
    select: { id: true, userId: true },
  })
  const profileIdByUserId = new Map<string, number>(profiles.map((p) => [p.userId, p.id]))

  console.log(`✅ profiles: ${profiles.length}`)

  // =========
  // 2) SNS links
  // =========
  const snsRows: { userId: number; platform: SnsPlatform; url: string }[] = []

  for (const [, uAny] of usersArray) {
    const u: any = uAny
    const pid = profileIdByUserId.get(u.id)
    if (!pid) continue
    const sns = u.sns
    if (!sns) continue

    if (sns.instagram) {
      snsRows.push({
        userId: pid,
        platform: mapSnsPlatform("instagram"),
        url: `https://instagram.com/${sns.instagram}`,
      })
    }
    if (sns.x) {
      snsRows.push({
        userId: pid,
        platform: mapSnsPlatform("x"),
        url: `https://x.com/${sns.x}`,
      })
    }
  }

  if (snsRows.length) {
    // SnsLink に unique が無いので重複が嫌なら一旦 deleteMany してから入れるのが安全
    await prisma.snsLink.createMany({ data: snsRows })
  }
  console.log(`✅ snsLinks: ${snsRows.length}`)

  // =========
  // 3) Circles
  // =========
  await prisma.circle.createMany({
    data: dummyCircles.map((c: any) => ({
      id: c.id, // ダミーの "circ1" をそのまま使う（uuid default だけど String id なのでOK）
      name: c.name,
      category: c.category,
      description: c.description ?? null,
      headerImageUrl: c.image ?? null,
    })),
    skipDuplicates: true,
  })

  console.log(`✅ circles: ${dummyCircles.length}`)

  // =========
  // 4) Circle memberships（members 数ぶん入れる）
  // =========
  const allUserIds = profiles.map((p) => p.userId)
  const membershipRows: { userId: number; circleId: string; role: CircleRole }[] = []

  for (const c of dummyCircles as any[]) {
    const memberCount = Math.min(Number(c.members ?? 0), allUserIds.length)
    for (let i = 0; i < memberCount; i++) {
      const userIdStr = allUserIds[i]
      const pid = profileIdByUserId.get(userIdStr)
      if (!pid) continue
      membershipRows.push({
        userId: pid,
        circleId: c.id,
        role: i === 0 ? CircleRole.ADMIN : CircleRole.MEMBER,
      })
    }
  }

  if (membershipRows.length) {
    // unique(userId, circleId) があるので skipDuplicates OK
    await prisma.circleMembership.createMany({
      data: membershipRows,
      skipDuplicates: true,
    })
  }
  console.log(`✅ circleMemberships: ${membershipRows.length}`)

  // =========
  // 5) Circle posts（initialPosts を CirclePost に入れる）
  // どの circle に投稿するかダミーに無いので、交互に circ1/circ2 に割当
  // =========
  const circleIds = dummyCircles.map((c: any) => c.id)
  const postRows: { content: string; authorId: number; circleId: string }[] = []

  for (let i = 0; i < initialPosts.length; i++) {
    const p: any = initialPosts[i]
    const pid = profileIdByUserId.get(p.authorId)
    if (!pid) continue
    postRows.push({
      content: p.content,
      authorId: pid,
      circleId: circleIds[i % circleIds.length],
    })
  }

  if (postRows.length) {
    // CirclePost は id uuid なので createMany OK
    await prisma.circlePost.createMany({ data: postRows })
  }
  console.log(`✅ circlePosts: ${postRows.length}`)

  // =========
  // 6) chatRoom + ChatMessage（会話データを入れる）
  // - initialConversations(201/202) はこの schema に無いので、会話相手の userId を使ってメッセージを作る
  // - circle は circ1 にまとめる（必要なら会話ごとに circle 作る運用に変えられる）
  // =========
  const mainPid = profileIdByUserId.get("user_main")
  const defaultCircleId = circleIds[0]

  // ルームを会話ごとに作る
  const roomByConvId = new Map<number, string>()

  for (const conv of initialConversations as any[]) {
    const room = await prisma.chatRoom.create({
      data: {
        title: `DM-${conv.userId}`,
        circleId: defaultCircleId,
      },
      select: { id: true },
    })
    roomByConvId.set(conv.id, room.id)
  }

  // メッセージ投入
  const msgRows: { content: string; senderId: number; chatRoomId: string }[] = []

  for (const [convIdStr, msgsAny] of Object.entries(initialChatHistories)) {
    const convId = Number(convIdStr)
    const roomId = roomByConvId.get(convId)
    if (!roomId) continue

    const partnerUserId =
      (initialConversations as any[]).find((c) => c.id === convId)?.userId ?? null
    const partnerPid = partnerUserId ? profileIdByUserId.get(partnerUserId) : undefined

    for (const m of msgsAny as any[]) {
      const senderPid =
        m.sender === "me" ? mainPid : partnerPid

      if (!senderPid) continue
      msgRows.push({
        content: m.text,
        senderId: senderPid,
        chatRoomId: roomId,
      })
    }
  }

  if (msgRows.length) {
    await prisma.chatMessage.createMany({ data: msgRows })
  }

  console.log(`✅ chatRooms: ${roomByConvId.size}, chatMessages: ${msgRows.length}`)

  // =========
  // 7) Friendship（user_main の following/follower を友情として入れる）
  // =========
  const mainUser: any = dummyUsers["user_main"]
  const friendshipRows: { requesterId: number; addresseeId: number; status: FriendshipStatus }[] = []

  if (mainPid) {
    // user_main がフォローしてる user を PENDING として作る
    for (const uid of (mainUser.followingIds ?? []).filter((x: string) => x.startsWith("s"))) {
      const pid = profileIdByUserId.get(uid)
      if (!pid) continue
      friendshipRows.push({
        requesterId: mainPid,
        addresseeId: pid,
        status: FriendshipStatus.PENDING,
      })
    }

    // user_main をフォローしてる user を ACCEPTED として入れる（例）
    for (const uid of (mainUser.followerIds ?? []).filter((x: string) => x.startsWith("s"))) {
      const pid = profileIdByUserId.get(uid)
      if (!pid) continue
      friendshipRows.push({
        requesterId: pid,
        addresseeId: mainPid,
        status: FriendshipStatus.ACCEPTED,
      })
    }
  }

  // Friendship は unique(requesterId, addresseeId) があるので、重複対策は upsert が確実
  for (const f of friendshipRows) {
    await prisma.friendship.upsert({
      where: {
        requesterId_addresseeId: {
          requesterId: f.requesterId,
          addresseeId: f.addresseeId,
        },
      },
      create: f,
      update: { status: f.status },
    })
  }

  console.log(`✅ friendships: ${friendshipRows.length}`)

  console.log("🎉 Seeding done!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
