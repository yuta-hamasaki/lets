'use client'

import { useState } from 'react'
import { useStackApp, useUser } from '@stackframe/stack'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ALLOWED_DOMAINS } from '../../../lib/user/emailDomains'

const PLACEHOLDER_VALUE = '';

export default function SignUpPage() {
  const app = useStackApp()
  const user = useUser()
  const router = useRouter()
  // ユーザーが入力するメールアドレスの「@」より前の部分
  const [emailLocalPart, setEmailLocalPart] = useState('')
  const [emailDomain, setEmailDomain] = useState(PLACEHOLDER_VALUE)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState('')

  // 既にログイン済みの場合はダッシュボードへリダイレクト
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (emailDomain === PLACEHOLDER_VALUE) {
      setError('メールアドレスのドメインを選択してください');
      return;
    }
    // フォーム送信時に完全なメールアドレスを構築
    const fullEmail = `${emailLocalPart}@${emailDomain}`

    if (password.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return
    }
    
    setIsLoading(true)

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const result = await app.signUpWithCredential({
        email: fullEmail, 
        password,
        noRedirect: true,
        verificationCallbackUrl: `${origin}/auth/email-verified`,
      })

      if (result.status === 'ok') {
        setInfo('確認メールを送信しました。メール内のリンクをクリックして認証を完了してください。')
      } else {
        if (result.error.code === 'USER_WITH_EMAIL_ALREADY_EXISTS') {
          setError('このメールアドレスは既に登録されています')
        } else if (result.error.code === 'INVALID_EMAIL') {
          // ドメインを制限しているため、このエラーは主にlocal partが無効な場合に出る
          setError('メールアドレスのユーザー名（@より前の部分）が有効ではありません')
        } else {
          setError('登録に失敗しました')
        }
      }
    } catch (err: any) {
      setError('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <main className="min-h-screen flex items-start justify-center pt-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl px-5 py-4">
          <div className="text-center mb-4">
            <h1 className="text-lg font-medium text-slate-800">
              アカウント作成
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email-local" className="block text-xs font-medium text-slate-600 mb-1.5">
                大学のメールアドレス
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors bg-white/50">
                {/* @より前の部分の入力フィールド */}
                <input
                  id="email-local"
                  type="text"
                  required
                  value={emailLocalPart}
                  onChange={(e) => setEmailLocalPart(e.target.value)}
                  className="flex-grow px-3 py-2.5 focus:outline-none bg-transparent"
                  placeholder="@より前の部分"
                  disabled={isLoading}
                />
                
                {/* 区切り文字の '@' */}
                <span className="self-center px-1 text-slate-500">@</span>

                {/* ドメイン選択用のドロップダウン */}
                <select
                  id="email-domain"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className={`bg-white/80 text-xs focus:outline-none cursor-pointer disabled:opacity-50 appearance-none 
                  ${emailDomain === PLACEHOLDER_VALUE ? 'text-slate-400' : 'text-slate-700'}`}
                  disabled={isLoading}
                >
                {/* プレースホルダーのオプション (初期値) */}
                    <option value={PLACEHOLDER_VALUE} disabled hidden>
                      大学ドメインを選択
                    </option>
                  {ALLOWED_DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-600 mb-1.5">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50"
                placeholder="8文字以上"
                disabled={isLoading}
              />
            </div>

            {(error || info) && (
              <div className={`p-2.5 rounded-lg text-xs ${info ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {error || info}
                {error.includes('既に登録されています') && (
                  <div className="mt-1.5">
                    <Link href="/auth/signin" className="underline font-medium">
                      ログインページへ
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isLoading ? '登録中...' : 'アカウント作成'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400">または</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            既にアカウントをお持ちの方は{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}