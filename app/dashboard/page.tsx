'use client'

import { useUser, useStackApp } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'
import { getProfile } from '@/lib/user/userAction'




export default function DashboardPage() {
  const user = useUser()
  const app = useStackApp()
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [checkedProfile, setCheckedProfile] = useState(false)

  const isEmailUnverified = Boolean(user && user.primaryEmail && user.primaryEmailVerified === false)
  

  useEffect(() => {
    // ユーザーが存在しない場合はサインアップページへ
    if (!user) {
      router.push('/auth/signup')
      return
    }

    // プロフィールがまだチェックされていない場合のみ取得
    if (checkedProfile) return

    async function fetchProfile() {
      setLoading(true)
      try {
        const profileData = await getProfile()
        setProfile(profileData)
        setCheckedProfile(true)
        
        if (!profileData) {
          // プロフィールがなければ作成ページへ
          router.push('/dashboard/profile/create')
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setCheckedProfile(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router, checkedProfile])


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
          href="/find/circles"
      />
      </div>
    </main>
  )
}

function DashboardCard({ title, description, icon, href }: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
          開く
          <Icons.arrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}