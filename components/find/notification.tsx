import { UserPlus, UserX } from 'lucide-react';
import { Modal } from '@/components/find/modal';

export const NotificationModal = ({ isOpen, onClose, notifications, onAction }:any) => (
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