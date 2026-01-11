'use client';
import React, { useState } from 'react';

type AuthPageProps = {
    onLogin: (role: 'student' | 'company') => void;
};

const UNIVERSITIES = [
    { name: '香川大学', domain: 'kagawa-u.ac.jp' },
    { name: '徳島大学', domain: 'tokushima-u.ac.jp' },
    { name: '愛媛大学', domain: 'ehime-u.ac.jp' },
    { name: '高知大学', domain: 'kochi-u.ac.jp' },
    { name: '高松大学', domain: 'takamatsu-u.ac.jp' },
];

const ORIENTATIONS = [
    { id: 'challenge', label: '挑戦', desc: 'スタートアップや新規事業に興味あり', icon: '🚀' },
    { id: 'stability', label: '安定', desc: '福利厚生や長期雇用を重視', icon: '🏠' },
    { id: 'specialty', label: '専門', desc: '特定の技術やスキルを極めたい', icon: '🛠' },
    { id: 'explore', label: '探索', desc: 'まだ決めていない・幅広く知りたい', icon: '🗺' },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const [view, setView] = useState<'login' | 'signup' | 'company-inquiry'>('login');
    const [signupStep, setSignupStep] = useState(0);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const [formData, setFormData] = useState({
        name: '', university: '', faculty: '', year: '3',
        orientation: '', email: '', instagram: '', x: '', otp: ''
    });

    const nextStep = () => setSignupStep(prev => prev + 1);
    const prevStep = () => setSignupStep(prev => prev - 1);

    const renderSignupWizard = () => {
        const steps = [
            { title: "大学選択", content: renderUnivSelect() },
            { title: "学部・氏名", content: renderBasicInfo() },
            { title: "スタイル", content: renderOrientation() },
            { title: "名刺のSNS連携", content: renderSNS() },
            { title: "本人確認", content: renderVerify() }
        ];

        return (
            <div className="min-h-screen bg-white animate-message flex flex-col">
                <header className="flex items-center px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                    <button onClick={() => signupStep === 0 ? setView('login') : prevStep()} className="p-2.5 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <div className="flex-1 text-center">
                        <span className="text-[0.75rem] font-black text-primary-blue block">STEP {signupStep + 1} / 5</span>
                        <h2 className="text-[1.1rem] font-black m-0">{steps[signupStep].title}</h2>
                    </div>
                    <div className="w-11"></div>
                </header>

                <div className="h-0.5 bg-slate-100 flex">
                    {[0,1,2,3,4].map(s => (
                        <div key={s} className={`flex-1 transition-all duration-300 ${s <= signupStep ? 'bg-primary-blue' : 'bg-transparent'}`} />
                    ))}
                </div>

                <div className="max-w-[400px] w-full mx-auto p-10">
                    {steps[signupStep].content}
                </div>
            </div>
        );
    };

    const renderUnivSelect = () => (
        <div className="animate-message">
            <div className="relative mb-8">
                <input 
                    type="text" placeholder="大学名を入力・検索..." 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 text-base outline-none focus:border-primary-blue"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <p className="text-[0.8rem] text-slate-500 font-black mb-5">主な大学</p>
            <div className="flex flex-col gap-3">
                {UNIVERSITIES.map(u => (
                    <button 
                        key={u.name}
                        onClick={() => { setFormData({...formData, university: u.name}); nextStep(); }}
                        className={`p-5 rounded-[20px] border-2 text-left font-black flex justify-between items-center transition-colors ${formData.university === u.name ? 'border-primary-blue bg-blue-50/30' : 'border-slate-100 bg-white'}`}
                    >
                        {u.name}
                        <span className="text-[0.75rem] text-slate-400 font-medium">{u.domain}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderBasicInfo = () => (
        <div className="flex flex-col gap-6 animate-message">
            <div>
                <label className="block text-[0.85rem] font-black text-slate-500 mb-2">お名前（フルネーム）</label>
                <input 
                    type="text" 
                    placeholder="例: 山田 健太" 
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 text-base outline-none focus:border-primary-blue" 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-[1.5]">
                    <label className="block text-[0.85rem] font-black text-slate-500 mb-2">学部</label>
                    <input 
                        type="text" 
                        placeholder="経済学部" 
                        className="w-full p-4 rounded-2xl border-2 border-slate-200 text-base outline-none focus:border-primary-blue" 
                        onChange={e => setFormData({...formData, faculty: e.target.value})} 
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-[0.85rem] font-black text-slate-500 mb-2">学年</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-slate-200 text-base bg-white focus:border-primary-blue outline-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                        <option value="1">1年</option><option value="2">2年</option><option value="3">3年</option><option value="4">4年</option>
                    </select>
                </div>
            </div>
            <button onClick={nextStep} className="p-5 rounded-[20px] bg-primary-blue text-white font-black text-lg shadow-xl shadow-blue-200 active:scale-98 transition-all mt-4">次へ進む</button>
        </div>
    );

    const renderOrientation = () => (
        <div className="grid grid-cols-2 gap-4 animate-message">
            {ORIENTATIONS.map(o => (
                <button 
                    key={o.id}
                    onClick={() => { setFormData({...formData, orientation: o.id}); nextStep(); }}
                    className={`p-7 rounded-[28px] border-2 text-center cursor-pointer transition-all ${formData.orientation === o.id ? 'border-primary-blue bg-blue-50/10' : 'border-slate-100 bg-white'}`}
                >
                    <div className="text-4xl mb-4">{o.icon}</div>
                    <div className="font-black text-slate-800 text-lg">{o.label}</div>
                    <div className="text-[0.75rem] text-slate-400 mt-1.5 leading-relaxed">{o.desc}</div>
                </button>
            ))}
        </div>
    );

    const renderSNS = () => (
        <div className="flex flex-col gap-6 animate-message">
            <p className="text-center text-slate-500 text-[0.9rem] leading-relaxed">名刺にSNSリンクを載せましょう。<br/>仲良くなった相手だけがあなたのSNSに飛べるようになります。</p>
            
            <div className="relative">
                <span className="absolute left-[1.1rem] top-1/2 -translate-y-1/2 text-pink-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>
                </span>
                <input 
                    type="text" 
                    placeholder="Instagram ID" 
                    className="w-full pl-14 pr-4 py-4 rounded-[20px] border-2 border-slate-200 text-lg outline-none focus:border-pink-500" 
                    onChange={e => setFormData({...formData, instagram: e.target.value})}
                />
            </div>

            <div className="relative">
                <span className="absolute left-[1.1rem] top-1/2 -translate-y-1/2 text-black">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path></svg>
                </span>
                <input 
                    type="text" 
                    placeholder="X (Twitter) ID" 
                    className="w-full pl-14 pr-4 py-4 rounded-[20px] border-2 border-slate-200 text-lg outline-none focus:border-slate-900" 
                    onChange={e => setFormData({...formData, x: e.target.value})}
                />
            </div>

            <button onClick={nextStep} className="p-5 rounded-[20px] bg-primary-blue text-white font-black text-lg">名刺を完成させる</button>
            <button onClick={nextStep} className="bg-transparent border-none text-slate-500 font-bold cursor-pointer">後で設定する</button>
        </div>
    );

    const renderVerify = () => (
        <div className="flex flex-col gap-6 animate-message">
            {!isEmailSent ? (
                <>
                    <div className="bg-blue-50 p-5 rounded-[20px] border border-blue-100 text-center">
                        <p className="text-[0.9rem] text-primary-blue font-black m-0">{formData.university}の認証を行います</p>
                    </div>
                    <input 
                        type="email" 
                        placeholder="大学メールアドレス" 
                        className="w-full p-4 rounded-[20px] border-2 border-slate-200 text-base outline-none focus:border-primary-blue" 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <button 
                        onClick={() => setIsEmailSent(true)}
                        disabled={!formData.email.includes('.ac.jp')}
                        className={`p-5 rounded-[20px] font-black text-lg transition-colors ${formData.email.includes('.ac.jp') ? 'bg-primary-blue text-white' : 'bg-slate-300 text-white cursor-not-allowed'}`}
                    >
                        認証コードを送信
                    </button>
                </>
            ) : (
                <>
                    <p className="text-center font-black text-slate-800 text-lg">メールをご確認ください</p>
                    <p className="text-center text-[0.85rem] text-slate-500 -mt-4">{formData.email} 宛に送られたコードを入力</p>
                    <input 
                        type="text" 
                        placeholder="0 0 0 0 0 0" 
                        className="w-full p-5 rounded-[20px] border-2 border-primary-blue text-center text-3xl font-black tracking-widest outline-none" 
                    />
                    <button onClick={() => onLogin('student')} className="p-5 rounded-[20px] bg-primary-pink text-white font-black text-lg shadow-xl shadow-pink-200">登録を完了する</button>
                    <button onClick={() => setIsEmailSent(false)} className="text-slate-500 border-none bg-transparent font-bold cursor-pointer">アドレスを修正</button>
                </>
            )}
        </div>
    );

    if (view === 'signup') return renderSignupWizard();

    return (
        <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="text-center mb-14">
                <h1 className="text-6xl font-black mb-2 tracking-tighter text-slate-900">LETS</h1>
                <p className="text-slate-500 font-black text-[0.9rem]">学生・企業・地域の「つながる」を加速</p>
            </div>

            <div className="bg-white rounded-[35px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-200 max-w-[430px] mx-auto w-full">
                {view === 'login' ? (
                    <>
                        <h2 className="text-[1.4rem] font-black mb-8 text-center text-slate-800">ログイン</h2>
                        <form onSubmit={(e) => { e.preventDefault(); onLogin('student'); }} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-[0.85rem] font-black mb-2.5 text-slate-500">ID / 大学メール</label>
                                <input type="email" placeholder="example@ac.jp" className="w-full p-4 rounded-[18px] border-2 border-slate-200 outline-none text-base focus:border-primary-blue" required />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-black mb-2.5 text-slate-500">パスワード</label>
                                <input type="password" placeholder="••••••••" className="w-full p-4 rounded-[18px] border-2 border-slate-200 outline-none text-base focus:border-primary-blue" required />
                            </div>
                            <button type="submit" className="mt-2 p-5 rounded-[20px] bg-primary-blue text-white font-black text-lg cursor-pointer shadow-xl shadow-blue-200 transition-transform active:scale-98">
                                ログインする
                            </button>
                        </form>

                        <div className="mt-12 border-t border-slate-100 pt-6 text-center">
                            <p className="text-[0.85rem] text-slate-500 mb-5 font-black">LETSをはじめる</p>
                            <button 
                                onClick={() => setView('signup')}
                                className="w-full py-4.5 rounded-[20px] border-2 border-primary-blue bg-transparent text-primary-blue font-black text-lg cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                                学生として新規登録
                            </button>
                            <button 
                                onClick={() => setView('company-inquiry')}
                                className="mt-5 text-slate-500 text-[0.85rem] font-black underline cursor-pointer bg-transparent border-none"
                            >
                                企業様はこちら
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center animate-message">
                        <div className="w-[70px] h-[70px] rounded-[24px] bg-indigo-50 flex items-center justify-center mx-auto mb-6 text-indigo-600">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                        </div>
                        <h2 className="text-[1.3rem] font-black mb-4 text-slate-800">企業アカウントの発行</h2>
                        <p className="text-[0.9rem] text-slate-500 leading-relaxed mb-10">
                            LETSの企業アカウントは事務局による審査制となっております。導入をご希望の企業様は事務局へお問い合わせください。
                        </p>
                        <button 
                            onClick={() => alert('お問い合わせフォームをシミュレートします')}
                            className="w-full p-5 rounded-[20px] bg-indigo-600 text-white font-black text-lg transition-transform active:scale-98"
                        >
                            事務局へ問い合わせる
                        </button>
                        <button 
                            onClick={() => setView('login')}
                            className="mt-7 text-slate-500 font-black cursor-pointer bg-transparent border-none"
                        >
                            ログインに戻る
                        </button>
                    </div>
                )}
            </div>

            <footer className="mt-auto py-8 text-center text-[0.8rem] text-slate-400 font-bold">
                &copy; 2025 LETS. All Rights Reserved.
            </footer>
        </div>
    );
};