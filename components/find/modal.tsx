import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, children, title }:any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-sm p-0">
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};