import React, { useState, useRef } from 'react';
import { X, UserPlus, UserX, Instagram } from 'lucide-react';
import { Modal } from '@/components/find/modal';
import { UserCard } from '@/components/find/user-card';

// ===== アイコンコンポーネント (ダミー) =====
const LineIcon = (props:any) => (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
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
const FindFriendsScreen = ({ onReport, onSendLike }) => (
    <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {dummyUsers.map(user => (<div key={user.id} className="h-full w-full flex-shrink-0"><UserCard user={user} onReport={onReport} onSendLike={onSendLike} /></div>))}
    </div>
);

const BusinessCardScreen = ({ friends }) => {
    const SnsIcon = ({ type, url }) => {
        const icons = {
            instagram: <Instagram size={28} className="text-gray-700 hover:text-pink-500" />,
            twitter: <X size={24} className="text-gray-700 hover:text-black" />,
            line: <LineIcon className="w-7 h-7" />,
        };
        const openLink = (e) => {
            e.stopPropagation();
            window.open(url, '_blank', 'noopener,noreferrer');
        };
        return <button onClick={openLink}>{icons[type] || null}</button>;
    };

    return (
        <div className="p-4"><h1 className="text-2xl font-bold mb-4">名刺ボックス</h1>
            {friends.length > 0 ? (
                <div className="space-y-3">{friends.map(friend => (
                    <div key={friend.id} className="bg-white p-3 rounded-lg shadow-md flex items-center">
                        <img src={friend.photo} alt={friend.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                        <div className="flex-1">
                            <p className="font-bold text-gray-800">{friend.name}</p>
                            <p className="text-sm text-gray-500">{friend.university} {friend.grade}年</p>
                            <div className="flex space-x-3 mt-2">
                                {Object.entries(friend.sns).map(([key, value]) => (<SnsIcon key={key} type={key} url={value} />))}
                            </div>
                        </div>
                    </div>
                ))}</div>
            ) : (
                <div className="text-center text-gray-500 mt-16">
                    <p>まだ名刺がありません。</p>
                    <p>友達探しで「ぐっと」を送って</p>
                    <p>新しい繋がりを見つけよう！</p>
                </div>
            )}
        </div>
    );
};


// ===== 通知モーダル =====
const NotificationModal = ({ isOpen, onClose, notifications, onAction }:any) => (
    <Modal isOpen={isOpen} onClose={onClose} title="届いた「ぐっと」">
        <div className="space-y-3">
            {notifications.filter(n => n.type === 'friend_request').length > 0 ? (
                notifications.filter(n => n.type === 'friend_request').map(n => (
                    <div key={n.id} className="flex items-center space-x-3">
                        <img src={n.sender.images[0]} alt={n.sender.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                            <p className="text-sm"><strong>{n.sender.name}</strong>さんから「ぐっと」が届きました。</p>
                            <p className="text-xs text-gray-400">{n.time}</p>
                        </div>
                        {n.status === 'pending' && (
                            <div className="flex space-x-2">
                                <button onClick={() => onAction(n.id, 'approved', n.sender)} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><UserPlus size={18} /></button>
                                <button onClick={() => onAction(n.id, 'denied', n.sender)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><UserX size={18} /></button>
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

// ===== メインアプリケーション =====
export default function App() {
    const [currentPage, setCurrentPage] = useState('findFriends');
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [userToReport, setUserToReport] = useState(null);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [friends, setFriends] = useState(initialFriends);

    // 友達リクエストに対するアクション
    const handleRequestAction = ({notificationId, newStatus, sender}:any) => {
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
    
    // 「ぐっと」を送信する
    const handleSendLike = (likedUser: any) => {
        const existing = notifications.some(n => n.sender.id === likedUser.id && n.type === 'friend_request');
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
    
    const handleReport = (user) => { 
        setUserToReport(user); 
        setShowReportModal(true); 
    };

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
                <main className="flex-grow overflow-y-auto pt-14 pb-20">{renderPage()}</main>
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
