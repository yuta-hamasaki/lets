"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useUser, useStackApp } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { hasStackEnv } from '@/lib/stack'

function HeaderAuthed() {
  const user = useUser()
  const app = useStackApp()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await app.signOut()
    router.push('/')
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return (
      <>
        <Link href="/auth/signin">
          <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-700 rounded-lg">
            ログイン
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg">
            新規登録
          </Button>
        </Link>
      </>
    )
  }

  return (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" className="text-gray-700">ダッシュボード</Button>
      </Link>
      <div className="relative ml-4" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-soft">
            {user.displayName?.charAt(0)?.toUpperCase() || user.primaryEmail?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-900">
              {user.displayName || user.primaryEmail?.split('@')[0] || 'ユーザー'}
            </div>
          </div>
          <Icons.chevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-gray-200 py-1 z-50">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Icons.logout className="w-4 h-4 mr-3" />ログアウト
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export function Header() {
  const stackReady = hasStackEnv()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-200 group-hover:scale-105">
              <Icons.zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Sample</span>
          </Link>
          <nav className="flex items-center gap-2">
            {stackReady ? (
              <HeaderAuthed />
            ) : (
              <>
                <Link href="/contact">
                  <Button variant="ghost" className="text-gray-700">お問い合わせ</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
