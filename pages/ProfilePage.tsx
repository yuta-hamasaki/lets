'use client'

import React, { useEffect, useState } from 'react';
import { UserProfileCard } from '../components/UserProfileCard';
import { PostCard } from '../components/PostCard';
import { styles, primaryBlue, borderLight } from '../styles';

type ProfilePageProps = {
  userId: string;
  onBack: () => void;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const res = await fetch(`/api/profile/${userId}?includePosts=true`, { cache: 'no-store' });

      if (!res.ok) {
        if (!cancelled) setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (cancelled) return;

      // UserProfileCard / PostCard が dummy 形式を期待してるなら「合わせて整形」
      setUser({
        id: data.profile.userId,
        name: data.profile.fullname,
        university: data.profile.university,
        faculty: data.profile.faculty,
        year: data.profile.grade,
        title: data.profile.desc ?? '',
        avatar: '', // schemaにないので必要なら追加
        interests: data.profile.skills ? data.profile.skills.split(',').map((s: string) => s.trim()) : [],
        hobbies: data.profile.hobbies ? data.profile.hobbies.split(',').map((s: string) => s.trim()) : [],
        sns: {
          instagram: data.profile.snsLinks?.find((s: any) => s.platform === 'INSTAGRAM')?.url ?? '',
          x: data.profile.snsLinks?.find((s: any) => s.platform === 'TWITTER')?.url ?? '',
        },
      });

      setUserPosts(
        data.posts.map((p: any) => ({
          id: p.id,
          authorId: data.profile.userId,
          author: data.profile.fullname,
          university: data.profile.university,
          timestamp: new Date(p.createdAt).toLocaleString('ja-JP'),
          content: p.content,
          tags: [`#${p.circle?.name ?? 'Circle'}`],
          category: p.circle?.category ?? '日常',
          likes: p.likes?.length ?? 0,
          comments: p.replies?.length ?? 0,
        }))
      );

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;
  }

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>ユーザーが見つかりません。</div>;
  }

  return (
    <main style={{ ...styles.profilePage, backgroundColor: '#F8FAFC' }}>
      {/* あなたの既存UIそのまま */}
      {/* ... */}
      <div style={{ marginTop: '0.5rem' }}>
        <UserProfileCard profileIdOrUserId={userId} isMe={false} />
      </div>

      <section style={{ marginTop: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1rem', color: primaryBlue, padding: '0 1.25rem' }}>
          投稿一覧
        </h3>

        <div style={styles.postList}>
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
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
