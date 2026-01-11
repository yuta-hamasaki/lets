
import React, { useState } from 'react';
import { styles, primaryBlue, primaryPink, borderLight, textPrimary, textSecondary } from '../styles';
import { dummyCircles } from '../data';

export const CirclesPage = () => {
    const [activeCategory, setActiveCategory] = useState('すべて');
    const categories = ['すべて', 'IT/技術', 'スポーツ', 'ライフスタイル', 'ビジネス', '文化/芸術'];

    const filteredCircles = dummyCircles.filter(circle => 
        activeCategory === 'すべて' || circle.category === activeCategory
    );

    return (
        <main style={{ ...styles.main, backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '1rem 1rem 120px 1rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '2rem', padding: '1rem 0' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: textPrimary, margin: '0 0 0.5rem 0' }}>サークルを探す</h2>
                <p style={{ fontSize: '0.85rem', color: textSecondary, fontWeight: '700' }}>仲間を見つけて、大学生活をもっと楽しく。</p>
            </header>

            <div style={{ 
                display: 'flex', gap: '0.75rem', overflowX: 'auto', 
                paddingBottom: '1.25rem', marginBottom: '1.5rem', 
                scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '0.6rem 1.25rem', borderRadius: '20px', border: 'none',
                            backgroundColor: activeCategory === cat ? primaryBlue : '#FFFFFF',
                            color: activeCategory === cat ? '#FFFFFF' : textSecondary,
                            fontSize: '0.85rem', fontWeight: '800', whiteSpace: 'nowrap',
                            boxShadow: activeCategory === cat ? `0 4px 12px ${primaryBlue}44` : '0 2px 8px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredCircles.map(circle => (
                    <div 
                        key={circle.id}
                        style={{
                            backgroundColor: '#FFFFFF', borderRadius: '28px', overflow: 'hidden',
                            border: `1px solid ${borderLight}`, boxShadow: '0 8px 25px rgba(0,0,0,0.02)',
                            display: 'flex', flexDirection: 'column', transition: 'transform 0.2s'
                        }}
                    >
                        <div style={{ height: '140px', position: 'relative' }}>
                            <img src={circle.image} alt={circle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute', top: '12px', left: '12px',
                                backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 12px',
                                borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900', color: primaryBlue,
                                backdropFilter: 'blur(5px)'
                            }}>
                                {circle.category}
                            </div>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0 }}>{circle.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: textSecondary, fontSize: '0.8rem', fontWeight: '800' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                    {circle.members}名
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: textSecondary, lineHeight: '1.5', margin: '0 0 1.25rem 0' }}>{circle.description}</p>
                            <button style={{
                                width: '100%', padding: '0.8rem', borderRadius: '16px', border: 'none',
                                backgroundColor: `${primaryBlue}10`, color: primaryBlue, fontWeight: '900',
                                fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                            }} onClick={() => alert('サークル詳細を表示します')}>
                                詳しく見る
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};
