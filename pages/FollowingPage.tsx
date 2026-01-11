
import React, { useState } from 'react';
import { styles, primaryBlue, primaryPink, borderLight, textSecondary, textPrimary } from '../styles';
import { dummyUsers, dummyFeaturedCompanies } from '../data';

type FollowingPageProps = {
    onBack: () => void;
    onViewProfile: (userId: string) => void;
    followedCompanyIds: string[];
    onToggleFollowCompany: (id: string) => void;
};

export const FollowingPage: React.FC<FollowingPageProps> = ({ 
    onBack, 
    onViewProfile, 
    followedCompanyIds,
    onToggleFollowCompany
}) => {
    // Top-level tabs: Following or Followers
    const [mainTab, setMainTab] = useState<'following' | 'followers'>('following');
    // Sub-level filters: Students or Companies
    const [subTab, setSubTab] = useState<'students' | 'companies'>('students');

    const me = dummyUsers['user_main'];
    const myFollowing = me.followingIds || [];
    const myFollowers = me.followerIds || [];

    // Helper to check if a user is a follower
    const isFollowerOfMe = (userId: string) => myFollowers.includes(userId);
    // Helper to check if I am following a user
    const isFollowedByMe = (userId: string) => myFollowing.includes(userId);
    // Helper to check for mutual follow
    const isMutual = (userId: string) => isFollowerOfMe(userId) && isFollowedByMe(userId);

    const renderUserList = (userIds: string[]) => {
        const users = userIds
            .map(id => dummyUsers[id])
            .filter(u => u && u.id !== 'user_main');

        if (users.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: textSecondary }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: '1rem' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>リストが空です</p>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {users.map(user => (
                    <div 
                        key={user.id} 
                        style={{ ...styles.listItem, padding: '1.25rem', margin: 0, position: 'relative' }} 
                        onClick={() => onViewProfile(user.id)}
                    >
                        <div style={{ ...styles.avatar, backgroundImage: `url(${user.avatar})` }}></div>
                        <div style={styles.listInfo}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p style={styles.listTitle}>{user.name}</p>
                                {isMutual(user.id) && (
                                    <span style={{ 
                                        backgroundColor: '#E0F2FE', color: '#0369A1', 
                                        fontSize: '0.65rem', padding: '2px 8px', 
                                        borderRadius: '6px', fontWeight: '900' 
                                    }}>
                                        相互フォロー
                                    </span>
                                )}
                            </div>
                            <p style={{ ...styles.listSubtitle, color: primaryBlue, fontWeight: '700' }}>{user.university}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button 
                                onClick={(e) => { e.stopPropagation(); /* Logic to toggle follow */ }}
                                style={{
                                    ...styles.followButton,
                                    backgroundColor: isFollowedByMe(user.id) ? '#F1F5F9' : primaryBlue,
                                    color: isFollowedByMe(user.id) ? textSecondary : '#FFF',
                                    borderColor: isFollowedByMe(user.id) ? borderLight : 'transparent',
                                    padding: '0.5rem 0.75rem', fontSize: '0.75rem'
                                }}
                            >
                                {isFollowedByMe(user.id) ? 'フォロー中' : 'フォロー'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCompanyList = (companyIds: string[]) => {
        const companies = companyIds
            .map(id => dummyFeaturedCompanies.find(c => c.id === id))
            .filter(c => !!c);

        if (companies.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: textSecondary }}>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>企業が見つかりません</p>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {companies.map(company => (
                    <div key={company!.id} style={{ ...styles.listItem, padding: '1.25rem', margin: 0 }}>
                        <div style={{ 
                            ...styles.avatar, 
                            background: `linear-gradient(135deg, ${primaryBlue}, #1E40AF)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#FFF', fontWeight: '900', borderRadius: '16px'
                        }}>{company!.logo}</div>
                        <div style={styles.listInfo}>
                            <p style={styles.listTitle}>{company!.name}</p>
                            <p style={styles.listSubtitle}>{company!.industry}</p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleFollowCompany(company!.id); }}
                            style={{
                                ...styles.followButton,
                                backgroundColor: followedCompanyIds.includes(company!.id) ? '#F1F5F9' : primaryBlue,
                                color: followedCompanyIds.includes(company!.id) ? textSecondary : '#FFF',
                                padding: '0.5rem 0.75rem', fontSize: '0.75rem'
                            }}
                        >
                            {followedCompanyIds.includes(company!.id) ? 'フォロー中' : 'フォロー'}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ ...styles.appContainer, backgroundColor: '#F8FAFC' }}>
            <header style={{
                display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', 
                backgroundColor: '#FFFFFF', borderBottom: `1px solid ${borderLight}`,
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <button onClick={onBack} style={styles.backButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 auto 0 0.5rem' }}>つながり</h2>
            </header>

            {/* Main Tabs */}
            <div style={{ 
                display: 'flex', backgroundColor: '#FFFFFF', borderBottom: `1px solid ${borderLight}`
            }}>
                <button 
                    onClick={() => setMainTab('following')}
                    style={{
                        flex: 1, padding: '1rem', border: 'none', background: 'none',
                        color: mainTab === 'following' ? primaryBlue : textSecondary,
                        fontWeight: '800', position: 'relative', fontSize: '0.95rem'
                    }}
                >
                    フォロー中
                    {mainTab === 'following' && <div style={{ ...styles.tabIndicator, height: '3px' }}></div>}
                </button>
                <button 
                    onClick={() => setMainTab('followers')}
                    style={{
                        flex: 1, padding: '1rem', border: 'none', background: 'none',
                        color: mainTab === 'followers' ? primaryBlue : textSecondary,
                        fontWeight: '800', position: 'relative', fontSize: '0.95rem'
                    }}
                >
                    フォロワー
                    {mainTab === 'followers' && <div style={{ ...styles.tabIndicator, height: '3px' }}></div>}
                </button>
            </div>

            {/* Sub Tabs / Filters */}
            <div style={{ padding: '1.25rem 1.25rem 0.5rem', display: 'flex', gap: '0.75rem' }}>
                <button 
                    onClick={() => setSubTab('students')}
                    style={{
                        padding: '0.6rem 1.25rem', borderRadius: '20px', border: 'none',
                        backgroundColor: subTab === 'students' ? textPrimary : '#E2E8F0',
                        color: subTab === 'students' ? '#FFF' : textSecondary,
                        fontSize: '0.8rem', fontWeight: '800', transition: 'all 0.2s'
                    }}
                >
                    学生
                </button>
                <button 
                    onClick={() => setSubTab('companies')}
                    style={{
                        padding: '0.6rem 1.25rem', borderRadius: '20px', border: 'none',
                        backgroundColor: subTab === 'companies' ? textPrimary : '#E2E8F0',
                        color: subTab === 'companies' ? '#FFF' : textSecondary,
                        fontSize: '0.8rem', fontWeight: '800', transition: 'all 0.2s'
                    }}
                >
                    企業
                </button>
            </div>

            <main style={{ padding: '1rem 1.25rem 120px' }}>
                {mainTab === 'following' ? (
                    subTab === 'students' ? renderUserList(myFollowing) : renderCompanyList(followedCompanyIds)
                ) : (
                    subTab === 'students' ? renderUserList(myFollowers.filter(id => !id.startsWith('c'))) : renderCompanyList(myFollowers.filter(id => id.startsWith('c')))
                )}
            </main>
        </div>
    );
};
