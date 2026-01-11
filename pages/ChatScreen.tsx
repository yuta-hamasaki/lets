'use client';
import React, { useState, useEffect, useRef } from 'react';
import { dummyUsers } from '../data';

type ChatScreenProps = {
    conversation: any;
    onBack: () => void;
    chatHistory: any[];
    onSendMessage: (chatId: number, messageText: string) => void;
    onViewProfile: (userId: string) => void;
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
    conversation, 
    onBack, 
    chatHistory, 
    onSendMessage,
    onViewProfile 
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const me = dummyUsers['user_main'];
    const partner = dummyUsers[conversation.userId];
    
    const interaction = me.interactionData[conversation.userId] || { messageCount: 0, snsStatus: 'none' };
    const [msgCount, setMsgCount] = useState(interaction.messageCount);
    const [snsStatus, setSnsStatus] = useState(interaction.snsStatus);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatHistory]);

    const handleSendMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        
        onSendMessage(conversation.id, newMessage);
        setNewMessage('');
        setMsgCount(prev => prev + 1);
    };

    const handleRequestSns = () => {
        if (msgCount < 50) return;
        setSnsStatus('pending');
        alert(`${conversation.name}さんにSNS閲覧リクエストを送信しました。`);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-10">
                <button onClick={onBack} className="p-1 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div className="text-center cursor-pointer" onClick={() => onViewProfile(conversation.userId)}>
                    <h2 className="text-[1.1rem] font-black m-0 text-slate-800">{conversation.name}</h2>
                    <div className="text-[0.65rem] text-slate-500 font-black mt-0.5">
                        親密度: <span className={msgCount >= 50 ? 'text-primary-pink' : 'text-primary-blue'}>{msgCount}/50</span>
                    </div>
                </div>
                <div 
                    className="w-9 h-9 rounded-xl bg-cover bg-center cursor-pointer border-2 border-slate-200 active:scale-95 transition-transform"
                    style={{ backgroundImage: `url(${partner?.avatar})` }}
                    onClick={() => onViewProfile(conversation.userId)}
                />
            </header>

            <div className="h-[3px] bg-slate-200 w-full relative">
                <div 
                    className={`h-full transition-all duration-500 ease-in-out ${msgCount >= 50 ? 'bg-primary-pink shadow-[0_0_10px_#EC489988]' : 'bg-primary-blue'}`}
                    style={{ width: `${Math.min((msgCount / 50) * 100, 100)}%` }}
                />
            </div>

            <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-slate-100/50">
                {chatHistory.map(msg => {
                    const isMe = msg.sender === 'me';
                    return (
                        <div key={msg.id} className={`max-w-[80%] animate-message ${isMe ? 'self-end' : 'self-start'}`}>
                            {!isMe && (
                                <div className="flex items-end gap-2.5">
                                    <div 
                                        className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 cursor-pointer border-2 border-white shadow-sm active:scale-95 transition-transform"
                                        style={{ backgroundImage: `url(${partner?.avatar})` }}
                                        onClick={() => onViewProfile(conversation.userId)}
                                    />
                                    <div className="bg-white text-slate-800 px-5 py-3.5 rounded-[24px_24px_24px_4px] shadow-md border border-slate-100">
                                        <p className="m-0 text-[1rem] leading-relaxed">{msg.text}</p>
                                        <span className="text-[0.65rem] text-slate-400 font-bold block mt-1.5">{msg.timestamp}</span>
                                    </div>
                                </div>
                            )}
                            {isMe && (
                                <div className="bg-gradient-to-br from-primary-blue to-blue-600 text-white px-5 py-3.5 rounded-[24px_24px_4px_24px] shadow-lg shadow-blue-200/50">
                                    <p className="m-0 text-[1rem] leading-relaxed">{msg.text}</p>
                                    <span className="text-[0.65rem] opacity-80 font-bold block mt-1.5 text-right">{msg.timestamp}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {msgCount >= 50 && snsStatus === 'none' && (
                    <div className="my-4 p-6 rounded-3xl bg-white border-2 border-dashed border-pink-300 text-center animate-message shadow-xl shadow-pink-100/50">
                        <p className="m-0 mb-4 text-[0.9rem] font-black text-primary-pink">
                            絆ランクアップ！🎉<br/>
                            <span className="text-[0.8rem] text-slate-500">SNSの相互開示ができるようになりました</span>
                        </p>
                        <button 
                            onClick={handleRequestSns}
                            className="px-6 py-3 rounded-2xl border-none bg-primary-pink text-white font-black cursor-pointer shadow-lg shadow-pink-200 active:scale-95 transition-transform"
                        >
                            SNS閲覧をリクエスト
                        </button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </main>

            <footer className="px-5 py-4 pb-10 bg-white border-t border-slate-200 z-10">
                <form onSubmit={handleSendMessageSubmit} className="flex gap-3 items-center w-full">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 px-5 py-3.5 rounded-[28px] border-2 border-slate-200 text-base outline-none bg-slate-50 focus:border-primary-blue transition-colors"
                    />
                    <button type="submit" className="bg-primary-blue text-white border-none w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-blue-200 shrink-0 active:scale-95 transition-transform">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};