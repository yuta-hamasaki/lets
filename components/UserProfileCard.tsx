"use client"

import React, { useEffect, useMemo, useState } from "react"

type UserProfileCardProps = {
  profileIdOrUserId: string // "12" or "stack_user_id"
  isMe?: boolean
}

type ProfileDTO = {
  id: number
  userId: string
  name: string
  nickname: string
  university: string
  faculty: string
  grade: string
  title: string
  desc: string
  avatarUrl: string | null
  sns: { instagram: string | null; x: string | null }
  privacySettings: { showUniversity: boolean; showRealName: boolean; profilePublic: boolean }
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profileIdOrUserId,
  isMe = false,
}) => {
  const [user, setUser] = useState<ProfileDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/profile/${profileIdOrUserId}`, {
          cache: "no-store",
        })
        if (!res.ok) throw new Error("FAILED_TO_FETCH_PROFILE")
        const data = (await res.json()) as ProfileDTO
        if (!cancelled) setUser(data)
      } catch (e) {
        console.error(e)
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [profileIdOrUserId])

  // 今は interactionData を dummy で持ってたけど、DB化してないので暫定で固定
  const interaction = useMemo(
    () => ({ messageCount: isMe ? 999 : 0, snsStatus: isMe ? "unlocked" : "none" }),
    [isMe]
  )

  const isUnlocked = isMe || interaction.snsStatus === "unlocked"
  const isPending = !isMe && interaction.snsStatus === "pending"
  const canRequest = !isMe && interaction.messageCount >= 50 && interaction.snsStatus === "none"
  const isLockedCount = !isMe && interaction.messageCount < 50

  const privacy = user?.privacySettings ?? {
    showUniversity: true,
    showRealName: true,
    profilePublic: true,
  }

  const handleLockedSns = () => {
    if (isLockedCount) {
      alert(`SNSを表示するには、まずチャットで50回以上会話しましょう！\n（現在: ${interaction.messageCount}/50回）`)
    } else if (canRequest) {
      alert("50回の会話を達成しました！\nチャット画面から「SNS閲覧リクエスト」を送って承認されると表示されます。")
    } else if (isPending) {
      alert("リクエスト送信済みです。\n相手が承認するとSNSリンクが解除されます。")
    }
  }

  const snsIconStyleClass = (active: boolean) =>
    `transition-all duration-200 flex items-center gap-2 no-underline px-3 py-1.5 rounded-xl border ${
      active
        ? "text-slate-800 bg-slate-100 border-slate-200 opacity-100 cursor-pointer"
        : "text-slate-400 bg-slate-50 border-transparent opacity-80 cursor-pointer"
    }`

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] mx-3 my-3 border border-slate-200 p-6">
        <div className="text-slate-500 font-bold">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-[2rem] mx-3 my-3 border border-slate-200 p-6">
        <div className="text-slate-500 font-bold">ユーザーが見つかりません。</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 mx-3 my-3 border border-slate-200 relative">
      {isMe && (
        <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[0.6rem] font-black flex items-center gap-1 border border-emerald-100 z-10">
          本人確認済
        </div>
      )}

      <div className="p-5 text-left">
        <div className="flex gap-5 items-center">
          <div
            className={`w-[72px] h-[72px] rounded-2xl bg-slate-100 overflow-hidden bg-cover bg-center shrink-0 shadow-sm ${
              isMe ? "border-[2.5px] border-primary-blue" : "border-2 border-white"
            }`}
            style={{ backgroundImage: user.avatarUrl ? `url(${user.avatarUrl})` : "none" }}
            role="img"
            aria-label={`${user.name}のプロフィール写真`}
          />

          <div className="flex-1">
            <h2 className="text-[1.25rem] font-black m-0 mb-0.5 text-slate-800">
              {privacy.showRealName ? user.name : "匿名ユーザー"}
            </h2>
            <p className="text-[0.8rem] text-slate-500 m-0 font-bold">{user.title || "学生"}</p>
          </div>
        </div>

        <div className="h-px bg-slate-200 w-full my-4 rounded-full" />

        <div className="flex justify-between items-start mb-5">
          <div>
            {privacy.showUniversity ? (
              <>
                <p className="text-[0.95rem] font-black m-0 text-slate-800">{user.university}</p>
                <p className="text-[0.75rem] text-slate-500 m-0">
                  {user.faculty && `${user.faculty} `}
                  {user.grade && `${user.grade}`}
                </p>
              </>
            ) : (
              <p className="m-0 text-[0.8rem] text-slate-500 font-bold">大学情報は非公開</p>
            )}
          </div>

          {!isMe && (
            <div
              className={`px-2.5 py-1 rounded-xl text-[0.65rem] font-black flex items-center gap-1 border ${
                interaction.messageCount >= 50
                  ? "bg-pink-50 text-primary-pink border-pink-100"
                  : "bg-slate-100 text-slate-500 border-none"
              }`}
            >
              絆 {interaction.messageCount}/50
            </div>
          )}
        </div>

        <div className="flex justify-start gap-5">
          {/* Instagram */}
          {isUnlocked && user.sns.instagram ? (
            <a
              href={`https://instagram.com/${user.sns.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={snsIconStyleClass(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              </svg>
              <span className="text-[0.7rem] font-black">Insta</span>
            </a>
          ) : (
            <div onClick={handleLockedSns} className={snsIconStyleClass(false)}>
              <span className="text-[0.7rem] font-black text-slate-400">{isPending ? "承認待ち" : "要相互承認"}</span>
            </div>
          )}

          {/* X */}
          {isUnlocked && user.sns.x ? (
            <a
              href={`https://x.com/${user.sns.x}`}
              target="_blank"
              rel="noopener noreferrer"
              className={snsIconStyleClass(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4l11.733 16h4.267l-11.733-16z"></path>
              </svg>
              <span className="text-[0.7rem] font-black">X</span>
            </a>
          ) : (
            <div onClick={handleLockedSns} className={snsIconStyleClass(false)}>
              <span className="text-[0.7rem] font-black text-slate-400">{isPending ? "承認待ち" : "要相互承認"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-t border-slate-200">
        <div className={`w-8 h-8 ${privacy.profilePublic ? "opacity-70" : "opacity-20"}`} role="img" aria-label="QRコード">
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
        {privacy.profilePublic ? (
          <button
            className="bg-none border-none text-primary-blue font-black text-[0.85rem] cursor-pointer"
            onClick={() => alert("名刺URLをコピーしました")}
          >
            URLをコピー
          </button>
        ) : (
          <p className="m-0 text-[0.7rem] text-slate-500 font-black">プライベート設定</p>
        )}
      </div>
    </div>
  )
}
