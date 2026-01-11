
import React from 'react';
import { UserProfileCard } from '../components/UserProfileCard';
import { PostCard } from '../components/PostCard';
import { styles, primaryBlue, borderLight } from '../styles';
import { dummyUsers, initialPosts } from '../data';

type ProfilePageProps = {
    userId: string;
    onBack: () => void;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onBack }) => {
    const user = dummyUsers[userId];
    const userPosts = initialPosts.filter(post => post.authorId === userId);

    if (!user) {
        return <div style={{padding: '2rem', textAlign: 'center'}}>ユーザーが見つかりません。</div>;
    }

    return (
        <main style={{ ...styles.profilePage, backgroundColor: '#F8FAFC' }}>
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '0.75rem 1rem', backgroundColor: '#FFFFFF', borderBottom: `1px solid ${borderLight}`,
                position: 'sticky', top: 0, zIndex: 100
            }}>
                 <button onClick={onBack} style={styles.backButton} aria-label="戻る">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>{user.name}</h2>
                <div style={{width: '40px'}}></div>
            </header>

            <div style={{ marginTop: '0.5rem' }}>
                <UserProfileCard user={user} />
            </div>

            <section style={{marginTop: '1.25rem'}}>
                <h3 style={{fontSize: '1.1rem', fontWeight: '900', marginBottom: '1rem', color: primaryBlue, padding: '0 1.25rem'}}>投稿一覧</h3>
                <div style={styles.postList}>
                    {userPosts.length > 0 ? (
                        userPosts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1.25rem', backgroundColor: '#FFF', margin: '0 1rem', borderRadius: '24px', border: `1px dashed ${borderLight}` }}>
                            <p style={{ color: '#94A3B8', fontWeight: '700', fontSize: '0.9rem' }}>投稿はまだありません。</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};
