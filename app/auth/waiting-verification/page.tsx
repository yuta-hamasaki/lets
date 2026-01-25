'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStackApp, useUser } from '@stackframe/stack'
import Link from 'next/link'
import { Icons } from '@/components/ui/icons'

export default function WaitingVerificationPage() {
  const app = useStackApp()
  const user = useUser()
  const router = useRouter()
  const contactChannels = user ? user.useContactChannels() : []
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState('')

  // 既に認証済みの場合はダッシュボードへ
  useEffect(() => {
    if (user && user.primaryEmailVerified) {
      router.push('/dashboard')
    }
  }, [user, router])

  // 未ログインの場合はサインアップへ
  useEffect(() => {
    if (user === null) {
      router.push('/auth/signup')
    }
  }, [user, router])

  const handleResend = async () => {
    if (!user) return
    try {
      setResending(true)
      setMessage('')
      
      const primary = contactChannels.find(c => c.type === 'email' && c.isPrimary)
      const anyEmail = primary || contactChannels.find(c => c.type === 'email')
      
      if (anyEmail) {
        await anyEmail.sendVerificationEmail()
        setMessage('認証メールを再送信しました。受信トレイをご確認ください。')
      } else {
        setMessage('送信可能なメールアドレスが見つかりませんでした。')
      }
    } catch (err) {
      console.error('Resend verification email error:', err)
      setMessage('再送信に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setResending(false)
    }
  }

  const handleCheckVerification = () => {
    // ページをリロードして最新の認証状態を取得
    window.location.reload()
  }

  const userEmail = user?.primaryEmail || user?.emails?.[0]?.email || ''

  return (
    <main className="min-h-screen flex items-start justify-center pt-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl px-6 py-8">
          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Icons.mailCheck className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* タイトル */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              メール認証をお願いします
            </h1>
            <p className="text-sm text-slate-600">
              認証メールを送信しました
            </p>
          </div>

          {/* メールアドレス表示 */}
          {userEmail && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-slate-600 mb-1">送信先メールアドレス</p>
              <p className="text-sm font-medium text-slate-800 break-all">{userEmail}</p>
            </div>
          )}

          {/* 説明文 */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <p className="text-sm text-slate-700">
                メールボックス（受信トレイ・迷惑メールフォルダ）を確認してください
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <p className="text-sm text-slate-700">
                メール内の「認証リンク」をクリックしてください
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <p className="text-sm text-slate-700">
                認証が完了すると、自動的にダッシュボードへ移動します
              </p>
            </div>
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('完了') || message.includes('再送信しました')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              {message}
            </div>
          )}

          {/* アクションボタン */}
          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <Icons.refresh className="w-4 h-4" />
              認証状態を確認
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 border-2 border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {resending ? '送信中...' : '認証メールを再送信'}
            </button>
          </div>

          {/* 注意事項 */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600">
              <strong className="text-slate-700">メールが届かない場合：</strong>
              <br />
              • 迷惑メールフォルダを確認してください
              <br />
              • メールアドレスが正しいか確認してください
              <br />
              • 数分待ってから「認証メールを再送信」をクリックしてください
            </p>
          </div>

          {/* リンク */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/signin" 
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              ログイン画面に戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
