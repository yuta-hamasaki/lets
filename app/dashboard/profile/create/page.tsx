"use client"

import { useEffect, useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@stackframe/stack"
import { createProfile, getProfile } from "@/lib/user/userAction"

type ProfileState = {
  nickname: string
  lastname: string
  firstname: string
  avatar?: string
  fullname: string
  university: string
  faculty: string
  grade: string
  desc: string
  hobbies: string | null
  skills: string | null
  portfolioUrl: string | null
}

export default function CreateProfilePage() {
  const router = useRouter()
  const user = useUser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkedProfile, setCheckedProfile] = useState(false)

  const [state, dispatch] = useReducer(
    (s: ProfileState, a: Partial<ProfileState>): ProfileState => ({ ...s, ...a }),
    {
      nickname: "",
      lastname: "",
      firstname: "",
      fullname: "",
      university: "",
      faculty: "",
      grade: "",
      desc: "",
      hobbies: "",
      skills: "",
      portfolioUrl: "",
      avatar: undefined,
    }
  )

  // Stack の avatarUrl を state に反映（初回だけ）
  useEffect(() => {
    const avatarUrl = (user as any)?.avatarUrl ?? undefined
    if (avatarUrl && !state.avatar) {
      dispatch({ avatar: avatarUrl })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(user as any)?.avatarUrl])

  // 既存プロフィールがあれば /dashboard へ
  useEffect(() => {
    // Stack がまだロード中っぽい場合（undefined）なら待つ
    if (user === undefined) return

    // 未ログインなら signup
    if (!user) {
      router.push("/auth/signup")
      return
    }

    if (checkedProfile) return

    ;(async () => {
      try {
        const profile = await getProfile(user.id)
        console.log(user.id, profile)
        if (profile) {
          router.push("/dashboard")
          return
        }
      } catch (e) {
        console.error("checkProfile failed:", e)
      } finally {
        setCheckedProfile(true)
      }
    })()
  }, [user, router, checkedProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const fullname = `${state.lastname} ${state.firstname}`.trim()

      // email は取れたら渡す（取れないなら server 側 fallback）
      const email =
        (user as any)?.primaryEmail ??
        (user as any)?.email ??
        (user as any)?.emails?.[0]?.email ??
        (user as any)?.emails?.[0] ??
        undefined

      // バリデーション
      if (!state.nickname.trim()) {
        setError("ニックネームを入力してください")
        setLoading(false)
        return
      }
      if (!state.lastname.trim() || !state.firstname.trim()) {
        setError("氏名を入力してください")
        setLoading(false)
        return
      }
      if (!state.university.trim()) {
        setError("大学名を入力してください")
        setLoading(false)
        return
      }
      if (!state.faculty.trim()) {
        setError("学部名を入力してください")
        setLoading(false)
        return
      }
      if (!state.grade) {
        setError("学年を選択してください")
        setLoading(false)
        return
      }
      if (!state.desc.trim()) {
        setError("自己紹介を入力してください")
        setLoading(false)
        return
      }

      const result = await createProfile({
        userId: user.id,
        email,
        nickname: state.nickname.trim(),
        fullname,
        university: state.university.trim(),
        faculty: state.faculty.trim(),
        grade: state.grade,
        desc: state.desc.trim(),
        hobbies: state.hobbies?.trim() ? state.hobbies.trim() : undefined,
        skills: state.skills?.trim() ? state.skills.trim() : undefined,
        portfolioUrl: state.portfolioUrl?.trim() ? state.portfolioUrl.trim() : undefined,
      })

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "プロフィールの作成に失敗しました")
      }
    } catch (err) {
      console.error(err)
      setError("エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  // ロード中
  if (user === undefined || !checkedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        読み込み中...
      </div>
    )
  }

  // 未ログインはリダイレクト済みなので何も表示しない
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">プロフィール作成</h1>
          <p className="text-gray-600 mb-8">あなたの情報を入力してプロフィールを作成しましょう</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ニックネーム <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={state.nickname}
                onChange={(e) => dispatch({ nickname: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  苗字 <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={state.lastname}
                  onChange={(e) => dispatch({ lastname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  名 <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={state.firstname}
                  onChange={(e) => dispatch({ firstname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                大学名 <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={state.university}
                onChange={(e) => dispatch({ university: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学部名 <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={state.faculty}
                  onChange={(e) => dispatch({ faculty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学年 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={state.grade}
                  onChange={(e) => dispatch({ grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">選択してください</option>
                  <option value="1年生">1年生</option>
                  <option value="2年生">2年生</option>
                  <option value="3年生">3年生</option>
                  <option value="4年生">4年生</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自己紹介 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={state.desc}
                onChange={(e) => dispatch({ desc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">スキル・特技</label>
              <input
                value={state.skills ?? ""}
                onChange={(e) => dispatch({ skills: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">趣味</label>
              <input
                value={state.hobbies ?? ""}
                onChange={(e) => dispatch({ hobbies: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ポートフォリオURL</label>
              <input
                type="url"
                value={state.portfolioUrl ?? ""}
                onChange={(e) => dispatch({ portfolioUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md disabled:opacity-50"
            >
              {loading ? "作成中..." : "プロフィールを作成"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
