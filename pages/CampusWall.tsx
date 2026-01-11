'use client';
import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { PostCard } from '../components/PostCard';
import { NewPostModal } from '../components/NewPostModal';
import { dummyUsers } from '../data';

type CampusWallProps = {
    posts: any[];
    onAddNewPost: (post: { title: string; content: string; category: string; }) => void;
    followedCompanyIds: string[];
    onToggleFollowCompany: (id: string) => void;
    onViewProfile: (userId: string) => void;
};

export const CampusWall: React.FC<CampusWallProps> = ({ 
    posts, 
    onAddNewPost, 
    onViewProfile
}) => {
    const [activeTab, setActiveTab] = useState('my-uni');
    const [activeCategory, setActiveCategory] = useState('すべて');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const me = dummyUsers['user_main'];
    const myUniversity = me.university;

    const categories = ['すべて', '日常', '学業', 'イベント', '就活'];

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesCategory = activeCategory === 'すべて' || post.category === activeCategory;
            const matchesUniversity = activeTab === 'my-uni' ? post.university === myUniversity : true;
            return matchesCategory && matchesUniversity;
        });
    }, [posts, activeCategory, activeTab, myUniversity]);
    
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            
            <nav className="flex bg-white px-5 py-2 border-b border-slate-200 gap-4">
                <button 
                    className={`flex-1 py-2.5 rounded-xl text-[0.85rem] font-black transition-all text-center ${activeTab === 'my-uni' ? 'bg-primary-blue text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'}`}
                    onClick={() => setActiveTab('my-uni')}
                >
                    {myUniversity}
                </button>
                <button 
                    className={`flex-1 py-2.5 rounded-xl text-[0.85rem] font-black transition-all text-center ${activeTab === 'national' ? 'bg-primary-blue text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'}`}
                    onClick={() => setActiveTab('national')}
                >
                    全国
                </button>
            </nav>

            <main className="pb-[120px]">
                <header className="p-5 bg-gradient-to-b from-white to-slate-50 mb-2">
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-primary-blue px-2.5 py-1 rounded-lg text-[0.7rem] font-black mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {activeTab === 'my-uni' ? 'キャンパス内限定' : '全国オープン'}
                    </div>
                    <h2 className="text-[1.25rem] font-black m-0 flex items-center gap-2">
                        {activeTab === 'my-uni' ? `${myUniversity}掲示板` : '全国掲示板'}
                    </h2>
                    <p className="text-[0.8rem] text-slate-500 mt-1 font-medium">
                        {activeTab === 'my-uni' 
                            ? '同じ大学の仲間だけで話せる場所です。' 
                            : '全国の大学の学生と繋がれる場所です。'}
                    </p>
                </header>

                <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
                    {categories.map(cat => {
                        const isActive = activeCategory === cat;
                        return (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl border-2 transition-all text-[0.8rem] font-black whitespace-nowrap cursor-pointer ${isActive ? 'bg-blue-50 border-primary-blue text-primary-blue' : 'bg-white border-slate-200 text-slate-500'}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
                
                <div className="flex flex-col gap-4 px-4">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                onViewProfile={onViewProfile}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 px-4 bg-white mx-4 rounded-3xl border border-dashed border-slate-200">
                            <p className="font-black text-slate-500">まだ投稿がありません</p>
                            <p className="text-[0.8rem] text-slate-400">最初の投稿をしてみませんか？</p>
                        </div>
                    )}
                </div>
            </main>

            <button 
                className="fixed bottom-[100px] right-6 w-14 h-14 rounded-full bg-primary-blue text-white text-3xl flex items-center justify-center shadow-xl shadow-blue-300 z-[999] active:scale-95 transition-transform"
                aria-label="新規投稿" 
                onClick={() => setIsModalOpen(true)}
            >
                +
            </button>
            {isModalOpen && <NewPostModal onClose={() => setIsModalOpen(false)} onSubmit={(data) => onAddNewPost({...data, category: activeCategory === 'すべて' ? '日常' : activeCategory})} />}
        </div>
    );
};