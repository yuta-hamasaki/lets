"use client"
import { useState, useReducer, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createProfile } from "@/lib/user/userAction"
import { useStackApp, useUser } from "@stackframe/stack"
import { getProfile } from "@/lib/user/userAction"

type ProfileState = {
  nickname: string;
  lastname: string;
  firstname: string;
  fullname: string;
  university: string;
  faculty: string;
  grade: string;
  desc: string;
  hobbies: string | null;
  skills: string | null;
  portfolioUrl: string | null;
};

export default function CreateProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkedProfile, setCheckedProfile] = useState(false)

  const app = useStackApp()
  const user = useUser()

  const [state, dispatch] = useReducer(
    (state: ProfileState, action: Partial<ProfileState>): ProfileState => ({
      ...state,
      ...action
    }),
    {
      nickname: '',
      lastname: '',
      firstname: '',
      fullname: '',
      university: '',
      faculty: '',
      grade: '',
      desc: '',
      hobbies: '',
      skills: '',
      portfolioUrl: ''
    }
  )

  useEffect(() => {
    // ユーザーが存在しない場合はサインアップページへ
    if (!user) {
      router.push('/auth/signup')
      return
    }

    // プロフィールチェック済みの場合はスキップ
    if (checkedProfile) return

    // 既にプロフィールがある場合はダッシュボードへリダイレクト
    async function checkProfile() {
      try {
        const profile = await getProfile()
        if (profile) {
          router.push('/dashboard')
        }
        setCheckedProfile(true)
      } catch (err) {
        console.error('Failed to check profile:', err)
        setCheckedProfile(true)
      }
    }

    checkProfile()
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // fullnameを生成
      const fullname = `${state.lastname} ${state.firstname}`
      
      const result = await createProfile({
        ...state,
        fullname,
        hobbies: state.hobbies || undefined,
        skills: state.skills || undefined,
        portfolioUrl: state.portfolioUrl || undefined,
      })

      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'プロフィールの作成に失敗しました')
      }
    } catch (err) {
      setError('エラーが発生しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            プロフィール作成
          </h1>
          <p className="text-gray-600 mb-8">
            あなたの情報を入力してプロフィールを作成しましょう
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ニックネーム */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                ニックネーム <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                required
                placeholder="例: たろう"
                value={state.nickname}
                onChange={(e) => dispatch({ nickname: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 名前 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                  苗字 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  required
                  placeholder="例: 山田"
                  value={state.lastname}
                  onChange={(e) => dispatch({ lastname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                  名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  required
                  placeholder="例: 太郎"
                  value={state.firstname}
                  onChange={(e) => dispatch({ firstname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 大学情報 */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                大学名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="university"
                name="university"
                required
                placeholder="例: 東京大学"
                value={state.university}
                onChange={(e) => dispatch({ university: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                  学部名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="faculty"
                  name="faculty"
                  required
                  placeholder="例: 工学部"
                  value={state.faculty}
                  onChange={(e) => dispatch({ faculty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  学年 <span className="text-red-500">*</span>
                </label>
                <select
                  id="grade"
                  name="grade"
                  required
                  value={state.grade}
                  onChange={(e) => dispatch({ grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="1年生">1年生</option>
                  <option value="2年生">2年生</option>
                  <option value="3年生">3年生</option>
                  <option value="4年生">4年生</option>
                  <option value="修士1年">修士1年</option>
                  <option value="修士2年">修士2年</option>
                  <option value="博士課程">博士課程</option>
                </select>
              </div>
            </div>

            {/* 自己紹介 */}
            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
                自己紹介 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="desc"
                name="desc"
                required
                rows={4}
                placeholder="あなた自身について教えてください"
                value={state.desc}
                onChange={(e) => dispatch({ desc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* オプション項目 */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                スキル・特技
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                placeholder="例: プログラミング、デザイン"
                value={state.skills ?? ""}
                onChange={(e) => dispatch({ skills: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-2">
                趣味
              </label>
              <input
                type="text"
                id="hobbies"
                name="hobbies"
                placeholder="例: 読書、旅行"
                value={state.hobbies ?? ""}
                onChange={(e) => dispatch({ hobbies: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2">
                ポートフォリオURL
              </label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                placeholder="https://example.com"
                value={state.portfolioUrl ?? ""}
                onChange={(e) => dispatch({ portfolioUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 送信ボタン */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? '作成中...' : 'プロフィールを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}