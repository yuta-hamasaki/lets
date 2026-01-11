'use client';
import React, { useState, useMemo } from 'react';
import { dummyFeaturedCompanies, dummyUsers } from '../data';

type AdZonePageProps = {
    followedCompanyIds: string[];
    onToggleFollow: (id: string) => void;
    onViewProfile?: (userId: string) => void;
    onViewCompany?: (companyId: string) => void;
};

const STUDENT_INTERESTS = ['IT', '製造', '金融', '教育', 'メーカー', '営業', 'クリエイティブ'];
const STUDENT_ORIENTATIONS = ['地元就職', '安定', '挑戦', '技術職', '成長環境'];
const COMPANY_INDUSTRIES = ['機械・製造', '金融・銀行', 'IT・通信', '建設・インフラ', '商社', '不動産', '医療・製薬'];

export const AdZonePage: React.FC<AdZonePageProps> = ({ 
    onViewProfile,
    onViewCompany
}) => {
    const [mode, setMode] = useState<'companies' | 'people'>('companies');
    const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [orientFilter, setOrientFilter] = useState('');

    const toggleFollowUser = (userId: string) => {
        setFollowedUserIds(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const filteredUsers = useMemo(() => {
        const allUsers = Object.values(dummyUsers).filter(u => u.id !== 'user_main');
        const filtered = allUsers.filter(user => {
            const matchesUniv = user.university?.toLowerCase().includes(q1.toLowerCase()) || 
                               user.faculty?.toLowerCase().includes(q1.toLowerCase());
            const matchesInterest = !q2 || 
                                   user.interests?.some((i: string) => i.toLowerCase().includes(q2.toLowerCase())) ||
                                   user.hobbies?.some((h: string) => h.toLowerCase().includes(q2.toLowerCase()));
            const matchesOrient = !orientFilter || user.orientation === orientFilter;
            return matchesUniv && matchesInterest && matchesOrient;
        });
        return filtered.slice(0, 100);
    }, [q1, q2, orientFilter]);

    const filteredCompanies = useMemo(() => {
        const filtered = dummyFeaturedCompanies.filter(c => {
            const matchesIndustry = c.industry.toLowerCase().includes(q1.toLowerCase());
            const matchesQuery = c.name.toLowerCase().includes(q2.toLowerCase()) || 
                               c.location.toLowerCase().includes(q2.toLowerCase());
            return matchesIndustry && matchesQuery;
        });
        return filtered.slice(0, 50);
    }, [q1, q2]);

    const totalCompanyCount = useMemo(() => {
        return dummyFeaturedCompanies.filter(c => {
            const matchesIndustry = c.industry.toLowerCase().includes(q1.toLowerCase());
            const matchesQuery = c.name.toLowerCase().includes(q2.toLowerCase()) || 
                               c.location.toLowerCase().includes(q2.toLowerCase());
            return matchesIndustry && matchesQuery;
        }).length;
    }, [q1, q2]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="absolute top-0 left-0 right-0 z-[100] px-5 pt-4 bg-white border-b border-slate-200">
                <div className="flex bg-slate-100 rounded-[20px] p-1">
                    {(['companies', 'people'] as const).map((m) => {
                        const label = m === 'companies' ? '企業を探す' : '学生を探す';
                        const isActive = mode === m;
                        return (
                            <button 
                                key={m}
                                onClick={() => {
                                    setMode(m);
                                    setQ1(''); setQ2(''); setOrientFilter('');
                                }}
                                className={`flex-1 py-3 rounded-2xl text-[0.95rem] font-black cursor-pointer transition-all duration-300 ${isActive ? 'bg-white text-primary-blue shadow-lg' : 'bg-transparent text-slate-500'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <main className="pt-[110px] px-5 pb-[120px]">
                <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col gap-4 mb-8">
                    <div className="relative">
                        <div className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-primary-blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder={mode === 'people' ? "大学名・学部で検索..." : "業種・エリアで検索..."} 
                            value={q1}
                            onChange={(e) => setQ1(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-slate-200 text-base outline-none focus:border-primary-blue"
                        />
                    </div>
                    
                    <div className="relative">
                        <div className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 text-primary-pink">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder={mode === 'people' ? "興味・趣味で検索 (IT, 製造など)..." : "社名・キーワード検索..."} 
                            value={q2}
                            onChange={(e) => setQ2(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 rounded-2xl border-2 border-slate-200 text-base outline-none focus:border-primary-pink"
                        />
                    </div>

                    {mode === 'people' && (
                        <div>
                            <p className="text-[0.8rem] text-slate-500 font-black mb-3">志向性で絞り込む</p>
                            <div className="flex flex-wrap gap-2">
                                {STUDENT_ORIENTATIONS.map(orient => (
                                    <button 
                                        key={orient}
                                        onClick={() => setOrientFilter(orient === orientFilter ? '' : orient)}
                                        className={`px-4 py-2 rounded-xl text-[0.8rem] font-black cursor-pointer transition-colors ${orientFilter === orient ? 'bg-primary-pink text-white' : 'bg-slate-100 text-slate-800'}`}
                                    >
                                        {orient}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-[0.8rem] text-slate-500 font-black mb-3">人気のタグ</p>
                        <div className="flex flex-wrap gap-2">
                            {(mode === 'people' ? STUDENT_INTERESTS : COMPANY_INDUSTRIES).map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => setQ2(tag)}
                                    className={`px-4 py-2 rounded-xl text-[0.8rem] font-black cursor-pointer transition-colors ${q2 === tag ? 'bg-primary-blue text-white' : 'bg-slate-50 text-slate-800'}`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[1.2rem] font-black text-slate-800">
                        {mode === 'people' ? 'おすすめの学生' : '注目の企業'}
                    </h3>
                    <span className="text-[0.85rem] text-primary-blue font-black bg-blue-50 px-3 py-1 rounded-xl">
                        {mode === 'people' ? filteredUsers.length : totalCompanyCount.toLocaleString()} Hit
                    </span>
                </div>

                {mode === 'people' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredUsers.map(user => (
                            <div 
                                key={user.id} 
                                className="bg-white rounded-[2rem] p-5 text-center border-2 border-slate-200 shadow-md shadow-slate-200/30 cursor-pointer active:scale-95 transition-transform"
                                onClick={() => onViewProfile && onViewProfile(user.id)}
                            >
                                <div className="w-16 h-16 rounded-3xl bg-slate-100 bg-cover mx-auto mb-4 border-2 border-white shadow-sm" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                                <h4 className="text-base font-black mb-1 text-slate-800">{user.name}</h4>
                                <p className="text-[0.75rem] text-primary-blue font-black mb-0.5">{user.university}</p>
                                <p className="text-[0.7rem] text-slate-500 mb-4">{user.faculty} {user.year}年</p>
                                
                                <div className="flex flex-wrap gap-1 justify-center mb-4">
                                    <span className="text-[0.65rem] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-bold">#{user.orientation}</span>
                                </div>

                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleFollowUser(user.id); }}
                                    className={`w-full py-2.5 rounded-xl text-[0.8rem] font-black transition-colors ${followedUserIds.includes(user.id) ? 'bg-slate-100 text-slate-500' : 'bg-primary-blue text-white'}`}
                                >
                                    {followedUserIds.includes(user.id) ? 'フォロー中' : 'つながる'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {filteredCompanies.map(company => (
                            <div 
                                key={company.id} 
                                className="bg-white rounded-[2rem] overflow-hidden border-2 border-slate-200 shadow-lg shadow-slate-200/40 cursor-pointer transition-transform active:scale-98"
                                onClick={() => onViewCompany && onViewCompany(company.id)}
                            >
                                <div className="h-[110px] relative">
                                    <img src={company.bgImage} className="w-full h-full object-cover" alt={company.name} />
                                    <div className="flex gap-2 absolute bottom-3 left-4">
                                        <div className="bg-blue-600/95 text-white px-3.5 py-1 rounded-xl text-[0.75rem] font-black backdrop-blur-md">{company.industry}</div>
                                        {company.listing && (
                                            <div className="bg-slate-900/80 text-white px-2.5 py-1 rounded-lg text-[0.65rem] font-black backdrop-blur-md">{company.listing}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-[1.25rem] font-black m-0">{company.name}</h4>
                                            <p className="text-[0.85rem] text-slate-500 mt-1">{company.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-black text-primary-pink">{company.salary}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl">
                                        <div className="flex-1">
                                            <p className="text-[0.8rem] font-black text-slate-800 m-0">{company.internTitle}</p>
                                            <p className="text-[0.7rem] text-slate-500 mt-1">休日: {company.holidays}</p>
                                        </div>
                                        <div className="text-primary-blue">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};