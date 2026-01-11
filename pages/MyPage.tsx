import React from 'react';
import { UserProfileCard } from '../components/UserProfileCard';
import { PostCard } from '../components/PostCard';
import { dummyUsers, initialPosts } from '../data';

type MyPageProps = {
    onShowFollowing?: () => void;
    onShowPrivacy?: () => void;
    onLogout?: () => void;
    privacySettings?: any;
    onViewProfile?: (userId: string) => void;
};

export const MyPage: React.FC<MyPageProps> = ({ onShowFollowing, onShowPrivacy, onLogout, privacySettings, onViewProfile }) => {
    const user = { ...dummyUsers['user_main'], privacySettings };
    const userPosts = initialPosts.filter(post => post.authorId === user.id);

    return (
        <main className="bg-slate-50 min-h-screen pb-[120px]">
            <header className="text-center p-3 px-4 relative bg-white border-b border-slate-200">
                <h2 className="text-[1.2rem] font-black m-0 text-slate-800">マイページ</h2>
                {onLogout && (
                    <button 
                        onClick={onLogout}
                        className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent text-slate-500 font-bold text-[0.8rem] cursor-pointer"
                    >
                        ログアウト
                    </button>
                )}
            </header>
            
            <div className="mt-2">
                <UserProfileCard user={user} isMe={true} />
            </div>
            
            <section className="mt-2 px-4 overflow-x-auto no-scrollbar flex gap-2">
                <button onClick={onShowFollowing} className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-slate-200 text-[0.85rem] font-black whitespace-nowrap active:scale-95 transition-transform shadow-sm">
                    <div className="text-primary-blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
                    <span>フォロー</span>
                </button>

                <button onClick={onShowPrivacy} className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-slate-200 text-[0.85rem] font-black whitespace-nowrap active:scale-95 transition-transform shadow-sm">
                    <div className="text-emerald-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                    <span>プライバシー</span>
                </button>

                <button onClick={() => alert('開発中')} className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-slate-200 text-[0.85rem] font-black whitespace-nowrap active:scale-95 transition-transform shadow-sm">
                    <div className="text-slate-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
                    <span>設定</span>
                </button>
            </section>

            <section className="mt-6 px-5">
                <h3 className="text-[1.1rem] font-black mb-4 text-slate-800">あなたの投稿</h3>
                <div className="flex flex-col gap-4">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => <PostCard key={post.id} post={post} onViewProfile={onViewProfile} />)
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500 font-bold text-[0.9rem]">まだ投稿がありません</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};