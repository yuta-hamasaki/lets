import {Bell} from 'lucide-react';

export const Header = ({ onNotificationClick, notificationCount }:any) => (
    <header className="fixed top-0 left-0 right-0 bg-white h-14 flex items-center justify-between px-4 shadow-sm z-40 max-w-[320px] mx-auto w-full">
        <div className="text-2xl font-bold text-green-500">LETS</div>
        <button onClick={onNotificationClick} className="relative">
            <Bell size={24} className="text-gray-600" />
            {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{notificationCount}</span>
            )}
        </button>
    </header>
);