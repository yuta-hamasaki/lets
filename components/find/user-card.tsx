"use client"
import React, { useState, useRef } from 'react';
import { ThumbsUp, MoreVertical } from 'lucide-react';


export const UserCard = ({ user, onReport, onSendLike }:any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [guts, setGuts] = useState([]);
    const cardRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const isDragging = useRef(false);

    const handleDoubleClick = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
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
    };
    
    const handleTouchStart = (e) => touchStartX.current = e.targetTouches[0].clientX;
    const handleTouchMove = (e) => touchEndX.current = e.targetTouches[0].clientX;
    const handleMouseDown = (e) => { isDragging.current = true; touchStartX.current = e.clientX; };
    const handleMouseMove = (e) => { if (isDragging.current) touchEndX.current = e.clientX; };
    const handleMouseUp = () => { if (isDragging.current) { isDragging.current = false; handleSwipe(); } };

    return (
        <div ref={cardRef} className="w-full h-full rounded-xl overflow-hidden relative shadow-lg select-none snap-center" onDoubleClick={handleDoubleClick} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleSwipe} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
            <div className="w-full h-full flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                {user.images.map((img, index) => (<img key={index} src={img} alt={`${user.name}の写真 ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" draggable="false" />))}
            </div>
            {guts.map(gut => (<div key={gut.id} className="absolute animate-gut" style={{ left: gut.x, top: gut.y, transform: 'translate(-50%, -50%)' }}><ThumbsUp size={64} className="text-white drop-shadow-lg" fill="white" /></div>))}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 text-white p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold drop-shadow-md">{user.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold drop-shadow-md bg-black/30 px-2 rounded-md">{user.university} {user.grade}</span>
                        <button onClick={() => onReport(user)} className="text-white/80"><MoreVertical size={24} /></button>
                    </div>
                </div>
                <p className="text-sm drop-shadow-sm font-medium mt-2">{user.status}</p>
                <div className="flex flex-wrap gap-2 mt-2 overflow-hidden">
                    {user.hobbies.map(hobby => (<span key={hobby} className={`text-xs px-2 py-1 rounded-full ${currentUserHobbies.includes(hobby) ? 'bg-blue-500 text-white font-bold' : 'bg-white/30 text-white'}`}>{hobby}</span>))}
                </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {user.images.map((_, index) => (<div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}></div>))}
            </div>
        </div>
    );
};