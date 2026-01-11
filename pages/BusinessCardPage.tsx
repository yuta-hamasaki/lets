import React, { useState, useMemo } from 'react';
import { UserProfileCard } from '../components/UserProfileCard';
import { styles, primaryBlue } from '../styles';
import { dummyUsers, dummyCollectedCards } from '../data';

export const BusinessCardPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const sortedAndFilteredCards = useMemo(() => {
        // Step 1: Filter by search term
        const filtered = dummyCollectedCards.filter(card => 
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.university.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Step 2: Sort by name in ascending order (A-Z / あ-ん)
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    }, [searchTerm]);

    return (
        <main style={styles.businessCardPage}>
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>マイ名刺</h2>
            </header>

            <UserProfileCard user={dummyUsers['user_main']} />
            
            <section style={{ marginTop: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={primaryBlue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                        名刺ボックス
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: primaryBlue, fontWeight: '800' }}>
                        {sortedAndFilteredCards.length} 枚
                    </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="名前や大学名で検索..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem 1rem 3rem',
                                borderRadius: '18px',
                                border: `2px solid ${primaryBlue}20`,
                                backgroundColor: '#fff',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}
                        />
                        <svg 
                            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: primaryBlue }}
                            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedAndFilteredCards.length > 0 ? (
                        sortedAndFilteredCards.map(card => (
                            <div key={card.id} style={{ ...styles.listItem, border: `1.5px solid ${primaryBlue}10` }}>
                                <div style={{
                                    ...styles.avatar,
                                    width: '52px',
                                    height: '52px',
                                    backgroundColor: `${primaryBlue}05`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '900',
                                    color: primaryBlue,
                                    fontSize: '1.2rem',
                                    border: `1.5px solid ${primaryBlue}20`
                                }} role="img" aria-label={`${card.name}のアバター`}>
                                    {card.name[0]}
                                </div>
                                <div style={styles.listInfo}>
                                    <p style={{ ...styles.listTitle, fontSize: '1.1rem' }}>{card.name}</p>
                                    <p style={{ ...styles.listSubtitle, color: primaryBlue, fontWeight: '700' }}>{card.university}</p>
                                    <p style={{ ...styles.listSubtitle, marginTop: '2px' }}>{card.title}</p>
                                </div>
                                <div style={{ color: `${primaryBlue}33` }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <p style={{ fontSize: '1rem', fontWeight: '800' }}>該当する名刺がありません</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};
