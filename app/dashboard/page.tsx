'use client'

import { useUser, useStackApp } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Icons } from '@/components/ui/icons'
import { getProfile } from '@/lib/user/userAction'
import { DashboardCard } from '@/components/dashboard'

export default function DashboardPage() {
  const user = useUser()
  const app = useStackApp()
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const hasCheckedProfile = useRef(false)

  const isEmailUnverified = Boolean(user && user.primaryEmail && user.primaryEmailVerified === false)

  useEffect(() => {
    // 既にチェック済みなら何もしない
    if (hasCheckedProfile.current) return

    // ユーザーが存在しない場合はサインアップページへ
    if (!user) {
      router.push('/auth/signup')
      return
    }

    async function fetchProfile() {
      try {
        hasCheckedProfile.current = true
        if (!user) return
        const profileData = await getProfile(user.id)
        setProfile(profileData)
        
        if (!profileData) {
          // プロフィールがなければ作成ページへ
          router.push('/dashboard/profile/create')
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router])

  if (loading) {
    return <div>Loading...</div> //TODO: loading component
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {isEmailUnverified && (
          <div className="mb-4 p-3 rounded-lg border text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
            メールアドレスが未認証です。<a href="/auth/email-verified" className="underline">認証メールのリンク</a>を確認してください。
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 rounded-lg border text-sm bg-gray-50 text-gray-700 border-gray-200">{message}</div>
        )}
      </div>

      {/* ナビゲーション（仮） */}
      <div className="container mx-auto px-4">
        <DashboardCard
          title="サークルを探す"
          description="興味のあるサークルを見つけましょう。"
          icon={<Icons.users className="w-6 h-6" />}
          href="/dashboard/find"
        />
      </div>
    </main>
  )
}

