"use client"
import React, { useState, useRef } from 'react';
import { X, UserPlus, UserX, Instagram, ThumbsUp, MoreVertical } from 'lucide-react';
import { Modal } from '@/components/find/modal';
import { Header } from '@/components/find/header';
import { Footer } from '@/components/find/footer';
import Image from 'next/image'; // 修正: Image をインポート

// ===== アイコンコンポーネント (ダミー) =====
const LineIcon = (props:any) => (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* ... SVG Path Data ... */}
        <path d="M224,48H32A16,16,0,0,0,16,64V176a16,16,0,0,0,16,16H88.4a15.9,15.9,0,0,1,11.3,4.7l32.6,32.6a8,8,0,0,0,11.4,0l32.6-32.6a15.9,15.9,0,0,1,11.3-4.7H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Z" fill="#06C755"/>
        <path fill="#fff" d="M103.3,144H90.8V114.9h-6.7v-9.3h6.7V98.2c0-5.3,2.4-13.4,13.5-13.4h9.9v9.1h-5.8c-2.8,0-3.9,1.3-3.9,3.8v7.2h9.9l-1.2,9.3h-8.7V144Z"/>
        <path fill="#fff" d="M136.6,144h-13V84.8h13V144Z"/>
        <path fill="#fff" d="M165.5,84.8h13.3V135c0,4.1-1.3,6.6-4.2,6.6s-4.2-2.5-4.2-6.6V84.8Z"/>
        <path fill="#fff" d="M123.3,144H110.8V84.8h12.5V144Z"/>
    </svg>
);


// ===== ダミーデータ =====
const currentUserHobbies = ['プログラミング', 'カフェ巡り', '読書'];

const dummyUsers = [
  {
    id: 1, name: '拓也', grade: 'III', university: '香川大学', faculty: '創造工学部',
    images: ['https://placehold.co/400x600/a2d2ff/ffffff?text=Takuya+1', 'https://placehold.co/400x600/bde0fe/ffffff?text=Takuya+2', 'https://placehold.co/400x600/ffafcc/ffffff?text=Takuya+3'],
    status: '夏休みは旅行に行きたい！✈️',
    hobbies: ['旅行', 'カメラ', 'カフェ巡り', 'プログラミング'],
    sns: { instagram: 'takuya_01', twitter: 'takuya_x' }
  },
  {
    id: 2, name: '美咲', grade: 'II', university: '香川大学', faculty: '経済学部',
    images: ['https://placehold.co/400x600/ffc8dd/ffffff?text=Misaki+1', 'https://placehold.co/400x600/cdb4db/ffffff?text=Misaki+2'],
    status: '最近、K-POPにハマってます🫰',
    hobbies: ['K-POP', 'ダンス', '韓国ドラマ', 'カフェ巡り'],
    sns: { instagram: 'misaki_kpop', line: 'https://line.me/ti/p/HIJKLMN' }
  },
  {
    id: 3, name: '健太', grade: 'IV', university: '香川大学', faculty: '法学部',
    images: ['https://placehold.co/400x600/8ecae6/ffffff?text=Kenta+1'],
    status: '就活終わった！気軽に話しましょう！',
    hobbies: ['ゲーム', 'アニメ', 'プログラミング', '筋トレ'],
    sns: { twitter: 'kenta_game' }
  },
];

const initialNotifications = [
    { id: 1, type: 'friend_request', sender: { id: 4, name: 'さやか', images: ['https://placehold.co/100x100/fec5bb/ffffff?text=S'] }, status: 'pending', time: '10分前' },
    { id: 2, type: 'friend_request', sender: { id: 5, name: '雄大', images: ['https://placehold.co/100x100/83c5be/ffffff?text=Y'] }, status: 'pending', time: '1時間前' },
    { id: 3, type: 'friend_request', sender: { id: 2, name: '美咲', images: ['https://placehold.co/400x600/ffc8dd/ffffff?text=Misaki+1']}, status: 'approved', time: '1日前' },
];

const initialFriends = [
    { id: 2, name: '美咲', university: '香川大学', grade: 'II', photo: 'https://placehold.co/400x600/ffc8dd/ffffff?text=Misaki+1', sns: { instagram: 'misaki_kpop', line: 'https://line.me/ti/p/HIJKLMN' } },
];



// ===== 画面コンポーネント =====

// 修正: UserCard をファイルの下部で定義
// export const UserCard = ...

const FindFriendsScreen = ({ onReport, onSendLike }: any) => (
    <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {dummyUsers.map(user => (
            <div key={user.id} className="h-full w-full flex-shrink-0">
                <UserCard user={user} onReport={onReport} onSendLike={onSendLike} />
            </div>
        ))}
    </div>
);


interface Friend {
    id: number;
    name: string;
    university: string;
    grade: string;
    photo: string;
    sns: { [key: string]: string };
}

interface SnsIconProps {
    type: 'instagram' | 'twitter' | 'line';
    url: string;
}

const BusinessCardScreen = ({ friends }: { friends: Friend[] }) => {
    
    const SnsIcon = ({ type, url }: SnsIconProps) => {
        const icons = {
            // 修正: オブジェクト定義構文エラーを修正。不正な位置にあった Image タグを削除
            instagram: <Instagram size={24} className="text-gray-700 hover:text-pink-500" />,
            twitter: <X size={24} className="text-gray-700 hover:text-black" />,
            line: <LineIcon className="w-7 h-7" />,
        };
        const openLink = (e: React.MouseEvent) => {
            e.stopPropagation();
            window.open(url, '_blank', 'noopener,noreferrer');
        };
        return <button onClick={openLink}>{icons[type] || null}</button>;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">名刺ボックス</h1>
            {friends.length > 0 ? (
                <div className="space-y-3">
                    {friends.map(friend => (
                        <div key={friend.id} className="bg-white p-3 rounded-lg shadow-md flex items-center">
                            {/* 修正: next/image を使用 */}
                            <Image src={friend.photo} alt={friend.name} width={64} height={64} className="w-16 h-16 rounded-full mr-4 object-cover" />
                            <div className="flex-1">
                                <p className="font-bold text-gray-800">{friend.name}</p>
                                <p className="text-sm text-gray-500">{friend.university} {friend.grade}年</p>
                                <div className="flex space-x-3 mt-2">
                                    {/* 修正: TypeScriptの型エラーを修正 (string を union 型にキャスト) */}
                                    {Object.entries(friend.sns).map(([key, value]) => (
                                        <SnsIcon key={key} type={key as 'instagram' | 'twitter' | 'line'} url={value} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // 修正: 不正な位置にあった useState を削除
                <div className="text-center text-gray-500 mt-10">
                    <p>まだ名刺がありません。</p>
                    <p>友達探しで「ぐっと」を送って</p>
                    <p>新しい繋がりを見つけよう！</p>
                </div>
            )}
        </div>
    );
};


// ===== メインアプリケーション =====
export default function Find() {
    const [currentPage, setCurrentPage] = useState('findFriends');
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    // 修正: userToReport の型を正しく指定
    const [userToReport, setUserToReport] = useState<{ id: number; name: string } | null>(null);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [friends, setFriends] = useState(initialFriends);

    // 友達リクエストに対するアクション
    const handleRequestAction = ({ notificationId, newStatus, sender }: any) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, status: newStatus } : n));
        if (newStatus === 'approved') {
            // 既に友達でない場合のみ追加
            if (!friends.some(f => f.id === sender.id)) {
                // `dummyUsers`から完全なユーザー情報を取得
                const fullSenderInfo = dummyUsers.find(u => u.id === sender.id) || sender;
                const newFriend = {
                    id: fullSenderInfo.id,
                    name: fullSenderInfo.name,
                    university: fullSenderInfo.university,
                    grade: fullSenderInfo.grade,
                    photo: fullSenderInfo.images[0],
                    sns: fullSenderInfo.sns
                };
                setFriends(prev => [newFriend, ...prev]);
            }
        }
    };
    
    // ===== 修正: `handleSendLike` と `handleReport` のロジックを分離・修正 =====

    // 「ぐっと」を送信する
    const handleSendLike = (likedUser: any) => {
        // 既にリクエストを送信済み（または承認済み）かチェック
        const existing = notifications.some(n => n.sender.id === likedUser.id && (n.status === 'pending' || n.status === 'approved'));

        if (!existing) {
            const newNotification = {
                id: Date.now(),
                type: 'friend_request',
                sender: likedUser,
                status: 'pending',
                time: 'たった今'
            };
            setNotifications(prev => [newNotification, ...prev]);
            alert(`${likedUser.name}さんに「ぐっと」を送信しました！相手の承認をお待ち下さい。`);
        } else {
            alert(`すでに${likedUser.name}さんにはリクエストを送信済みです。`);
        }
    };
    
    // 報告処理
    const handleReport = (user: { id: number; name: string }) => { 
        setUserToReport(user); 
        setShowReportModal(true); 
    };

    // ====================================================================

    const pendingCount = notifications.filter(n => n.type === 'friend_request' && n.status === 'pending').length;

    const renderPage = () => {
        switch (currentPage) {
            case 'findFriends': return <FindFriendsScreen onReport={handleReport} onSendLike={handleSendLike} />;
            case 'businessCard': return <BusinessCardScreen friends={friends} />;
            default: return <FindFriendsScreen onReport={handleReport} onSendLike={handleSendLike} />;
        }
    };

    return (
        <div className="w-full h-screen bg-gray-200 flex justify-center items-center font-sans">
            <div className="relative w-full h-full max-w-[320px] bg-white shadow-2xl overflow-hidden flex flex-col">
                <Header onNotificationClick={() => setShowNotificationModal(true)} notificationCount={pendingCount} />
                <main className="flex-grow overflow-y-auto ">{renderPage()}</main>
                <Footer activePage={currentPage} onNavigate={setCurrentPage} />

                {/* --- モーダル --- */}
                <NotificationModal 
                    isOpen={showNotificationModal}
                    onClose={() => setShowNotificationModal(false)}
                    notifications={notifications}
                    onAction={handleRequestAction}
                />

                <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="ユーザーを報告">
                  {userToReport && (
                        <div>
                            <p className="mb-4"><strong>{userToReport.name}</strong>さんに関する問題を報告しますか？</p>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">キャンセル</button>
                                <button onClick={() => { alert('報告が送信されました。'); setShowReportModal(false); }} className="px-4 py-2 bg-red-500 text-white rounded-lg">報告する</button>
                            </div>
                        </div>
                   )}
                </Modal>
            </div>
            
            <style>{`
                @keyframes gut-animation { 0% { transform: scale(0.5) translate(-50%, -50%); opacity: 1; } 100% { transform: scale(2) translate(-50%, -50%); opacity: 0; } }
                .animate-gut { animation: gut-animation 1s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-in-out; }
            `}</style>
        </div>
    );
}


// ===== NotificationModal =====
// (元々ファイル下部にあった定義)
export const NotificationModal = ({ isOpen, onClose, notifications, onAction }:any) => (
    <Modal isOpen={isOpen} onClose={onClose} title="届いた「ぐっと」">
        <div className="space-y-3">
            {notifications.filter((n:any) => n.type === 'friend_request').length > 0 ? (
                notifications.filter((n:any) => n.type === 'friend_request').map((n:any) => (
                    <div key={n.id} className="flex items-center space-x-3">
                        <img src={n.sender.images[0]} alt={n.sender.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm"><strong>{n.sender.name}</strong>さんから「ぐっと」が届きました。</p>
                            <p className="text-xs text-gray-400">{n.time}</p>
                        </div>
                        {n.status === 'pending' && (
                            <div className="flex space-x-2">
                                <button onClick={() => onAction({notificationId: n.id, newStatus: 'approved', sender: n.sender})} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><UserPlus size={18} /></button>
                                <button onClick={() => onAction({notificationId: n.id, newStatus: 'denied', sender: n.sender})} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><UserX size={18} /></button>
                            </div>
                        )}
                        {n.status === 'approved' && <span className="text-sm font-semibold text-green-600">承認済み</span>}
                        {n.status === 'denied' && <span className="text-sm font-semibold text-gray-500">拒否済み</span>}
                    </div>
                ))
            ) : (
                 <p className="text-center text-gray-500 py-4">通知はまだありません。</p>
            )}
        </div>
    </Modal>
);

// ===== UserCard =====
// (元々ファイル下部にあった定義)
export const UserCard = ({ user, onReport, onSendLike }:any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [guts, setGuts] = useState<{id: number, x: number, y: number}[]>([]); // 型を明記
    const cardRef = useRef<HTMLDivElement>(null); // Refの型を明記
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const isDragging = useRef(false);

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => { // イベントの型を明記
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newGut = { id: Date.now(), x, y };
        setGuts(prev => [...prev, newGut]);
        setTimeout(() => setGuts(prev => prev.filter(g => g.id !== newGut.id)), 1000);
        onSendLike(user);
    };

    const handleSwipe = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) setCurrentImageIndex(i => (i + 1) % user.images.length);
            else setCurrentImageIndex(i => (i - 1 + user.images.length) % user.images.length);
        }
        // リセット
        touchStartX.current = 0;
        touchEndX.current = 0;
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => touchStartX.current = e.targetTouches[0].clientX;
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => touchEndX.current = e.targetTouches[0].clientX;
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => { isDragging.current = true; touchStartX.current = e.clientX; };
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { if (isDragging.current) touchEndX.current = e.clientX; };
    const handleMouseUp = () => { if (isDragging.current) { isDragging.current = false; handleSwipe(); } };

    return (
        <div ref={cardRef} className="w-full h-full rounded-xl overflow-hidden relative shadow-lg select-none snap-center" onDoubleClick={handleDoubleClick} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleSwipe} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
            <div className="w-full h-full flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                {user.images.map((img: string, index: number) => (
                    <img key={index} src={img} alt={`${user.name}の写真 ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" draggable="false" />
                ))}
            </div>
            {guts.map(gut => (<div key={gut.id} className="absolute animate-gut" style={{ left: gut.x, top: gut.y, pointerEvents: 'none' }}><ThumbsUp size={64} className="text-white drop-shadow-lg" fill="white" /></div>))}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 text-white p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold drop-shadow-md">{user.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold drop-shadow-md bg-black/30 px-2 rounded-md">{user.university} {user.grade}</span>
                        <button onClick={(e) => { e.stopPropagation(); onReport(user); }} className="text-white/80"><MoreVertical size={24} /></button>
                    </div>
                </div>
                <p className="text-sm drop-shadow-sm font-medium mt-2">{user.status}</p>
                <div className="flex flex-wrap gap-2 mt-2 overflow-hidden">
                    {user.hobbies.map((hobby: string) => (<span key={hobby} className={`text-xs px-2 py-1 rounded-full ${currentUserHobbies.includes(hobby) ? 'bg-blue-500 text-white font-bold' : 'bg-white/30 text-white'}`}>{hobby}</span>))}
                </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2" style={{ pointerEvents: 'none' }}>
                {user.images.map((_: string, index: number) => (<div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}></div>))}
            </div>
        </div>
    );
};