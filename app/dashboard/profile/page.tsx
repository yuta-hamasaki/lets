"use client"
import { useState, useEffect } from 'react'
import { getProfile } from '@/lib/user/userAction'
import { useUser, useStackApp } from '@stackframe/stack'
import { useRouter } from 'next/navigation'



export default function Profile() {
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
          if (user === undefined) return
              if (user === null) {
      router.push("/auth/signup")
      return
    }
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
            if (!user) return
            const profileData = await getProfile(user.id)
            console.log( profileData)

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
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-strong border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.nickname || user?.primaryEmail?.split('@')[0] || 'ユーザー'} のプロフィール
          </h1>


        {isEmailUnverified && (
          <div className="mb-4 p-3 rounded-lg border text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
            メールアドレスが未認証です。<a href="/auth/email-verified" className="underline">認証メールのリンク</a>を確認してください。
          </div>
        )}

        {message && (
          <div className="mb-6 p-3 rounded-lg border text-sm bg-gray-50 text-gray-700 border-gray-200">{message}</div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <details className="group">
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-500 transition-colors list-none flex items-center justify-between">
              <span>アカウント設定</span>
              <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 space-y-3">
              {/* 退会ボタンを押したときだけエラーメッセージを出す。通常は説明のみ表示 */}
              <p className="text-xs text-gray-500">退会すると、アカウントと関連データは削除されます。</p>
              

                <div className="mb-3 p-2 rounded bg-yellow-50 border border-yellow-200">
                  <p className="text-xs text-yellow-700">プランはキャンセル予定です。<br />いま退会するとアカウントと関連データは削除され即時利用できなくなります。</p>
                </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                {/* 購読を管理ボタンは撤去 */}
                <button
                  onClick={async () => {
                    if (!user || deleting) return
                    
                    
                    // キャンセル予定の場合は即時削除の警告を表示
                    const confirmMessage = '退会するとアカウントと関連データは即座に削除されます。本当に退会しますか？この操作は取り消せません。'
                    
                    const ok = window.confirm(confirmMessage)
                    if (!ok) return
                    setDeleting(true)
                    setMessage('退会処理を実行しています…')
                    try {
                      const res = await fetch('/api/account/delete', { method: 'POST' })
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}))
                        if (res.status === 409) {
                          setMessage(data.error || 'プランの解約が必要です。購読を管理からプランをキャンセルしてください。')
                        } else if (res.status === 401) {
                          setMessage('未ログインのため処理できません。')
                        } else {
                          setMessage(data.error || '退会に失敗しました。時間をおいて再度お試しください。')
                        }
                        return
                      }
                      router.push('/')
                    } catch (e: any) {
                      console.error('Account deletion failed:', e)
                      setMessage('退会に失敗しました。時間をおいて再度お試しください。')
                    } finally {
                      setDeleting(false)
                    }
                  }}
                  disabled={!user || deleting}
                  className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                    deleting
                      ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400' 
                      : 'border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  {deleting ? '処理中…' : '退会'}
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>

      </div>
  )
}
