import React, { useState, useMemo } from 'react';
import { dummyUsers } from '../data';

const ChatListItem: React.FC<{ conversation: any, onOpenChat: (conv: any) => void, onViewProfile: (userId: string) => void }> = ({ conversation, onOpenChat, onViewProfile }) => {
    const partner = dummyUsers[conversation.userId];
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewProfile(conversation.userId);
    };

    return (
        <div 
            className="flex items-center p-4 bg-white rounded-2xl mb-3 border border-slate-200 gap-4 cursor-pointer transition-all duration-200 active:scale-[0.98]"
            onClick={() => onOpenChat(conversation)} 
            role="button" 
            tabIndex={0}
        >
            <div 
                className="w-[60px] h-[60px] rounded-full bg-slate-100 bg-cover shrink-0 border-2 border-white shadow-sm"
                style={{ backgroundImage: `url(${partner?.avatar})` }} 
                onClick={handleProfileClick} 
                role="button" 
                aria-label={`${conversation.name}のプロフィールを表示`}
            ></div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <span className="font-black text-base text-slate-800">{conversation.name}</span>
                        {partner?.interactionData && partner.interactionData['user_main']?.messageCount >= 50 && (
                            <span className="text-[0.65rem] text-primary-blue font-black bg-blue-50 px-1.5 py-0.5 rounded-md">
                                親友
                            </span>
                        )}
                    </div>
                    <span className="text-[0.7rem] text-slate-400 font-semibold">{conversation.timestamp}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className={`text-[0.85rem] truncate ${conversation.unread ? 'text-slate-800 font-bold' : 'text-slate-500 font-medium'}`}>
                        {conversation.lastMessage}
                    </p>
                    {conversation.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary-blue shadow-lg shadow-blue-200" aria-label="未読"></div>}
                </div>
            </div>
        </div>
    );
}

type MessagesPageProps = {
    conversations: any[];
    companyConversations: any[];
    onOpenChat: (conv: any) => void;
    onViewProfile: (userId: string) => void;
};

export const MessagesPage: React.FC<MessagesPageProps> = ({ conversations, onOpenChat, onViewProfile }) => {
    const [activeTab, setActiveTab] = useState('メイン');
    const [searchTerm, setSearchTerm] = useState('');
    
    const conversationsToShow = useMemo(() => {
        let currentList = conversations;
        if (!searchTerm) return currentList;
        return currentList.filter(conv => conv.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [conversations, searchTerm]);

    return (
        <main className="flex flex-col h-screen bg-slate-50">
            <header className="p-6 bg-white border-b border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[1.6rem] font-black m-0 text-slate-800">メッセージ</h2>
                    <div className="text-primary-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </div>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {['メイン', '一般'].map(tab => (
                        <button 
                            key={tab} 
                            className={`px-5 py-2.5 rounded-full border-1.5 transition-all text-[0.9rem] font-bold whitespace-nowrap cursor-pointer ${activeTab === tab ? 'bg-primary-blue text-white border-primary-blue' : 'bg-transparent text-slate-500 border-slate-200'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>
            <div className="px-6 py-4">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input 
                        type="search" 
                        placeholder="名前やメッセージを検索..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-1.5 border-slate-200 text-[0.95rem] outline-none bg-white focus:border-primary-blue" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="px-5 flex-1 overflow-y-auto pb-[120px]">
                {conversationsToShow.map(conv => (
                    <ChatListItem key={conv.id} conversation={conv} onOpenChat={onOpenChat} onViewProfile={onViewProfile} />
                ))}
            </div>
        </main>
    );
};