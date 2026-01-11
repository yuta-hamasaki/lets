'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BottomNavBarProps = {
    isCompany?: boolean;
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ isCompany = false }) => {
    const pathname = usePathname();
    
    const studentItems = [
        { id: '/', label: 'ホーム', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
        { id: '/ads', label: '見つける', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg> },
        { id: '/messages', label: 'DM', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
        { id: '/mypage', label: 'マイ', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> }
    ];

    const navItems = isCompany ? [
        { id: '/', label: 'ダッシュ', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
        { id: '/ads', label: '学生検索', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
    ] : studentItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-[85px] bg-white border-t border-slate-200 flex justify-around items-center z-[1000] pb-[env(safe-area-inset-bottom)]">
            {navItems.map(item => {
                const isActive = pathname === item.id;
                const activeColor = isCompany ? 'text-indigo-600' : 'text-primary-blue';
                return (
                    <Link
                        key={item.id}
                        href={item.id}
                        className="flex flex-col items-center gap-1 bg-none border-none cursor-pointer p-2 flex-1 no-underline"
                        aria-label={item.label}
                    >
                        <div className={`flex flex-col items-center transition-all duration-200 ${isActive ? `px-3 py-1 rounded-xl border-2 ${isCompany ? 'border-indigo-600' : 'border-primary-blue'}` : ''}`}>
                            <div className={isActive ? activeColor : 'text-slate-400'}>
                                {item.icon}
                            </div>
                            <span className={`text-[0.75rem] font-black ${isActive ? activeColor : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
};