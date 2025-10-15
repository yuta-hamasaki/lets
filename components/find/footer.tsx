import { Users, ClipboardList} from 'lucide-react';

export const Footer = ({ activePage, onNavigate }:any) => {
    const navItems = [
        { id: 'findFriends', icon: Users, label: '友達探し' },
        { id: 'businessCard', icon: ClipboardList, label: '名刺ボックス' },
    ];
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white h-20 px-2 flex justify-around items-center z-40 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.08)] max-w-[320px] mx-auto w-full">
            {navItems.map(item => (
                <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center justify-center w-1/4 transition-colors duration-200 ${activePage === item.id ? 'text-green-500' : 'text-gray-400'}`}>
                    <item.icon size={28} strokeWidth={activePage === item.id ? 2.5 : 2} />
                    <span className="text-xs mt-1 font-semibold">{item.label}</span>
                </button>
            ))}
        </footer>
    );
};