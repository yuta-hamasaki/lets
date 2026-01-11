
import React from 'react';
import { styles, primaryBlue, primaryPink, borderLight, textPrimary, textSecondary } from '../styles';
import { dummyUsers } from '../data';

type CompanyDashboardProps = {
    onLogout: () => void;
    onOpenChat: (conv: any) => void;
    onViewStudent: (id: string) => void;
};

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onLogout, onViewStudent }) => {
    // 簡易的な企業用データ
    const stats = [
        { label: '閲覧数', value: '1,280', color: primaryBlue },
        { label: '保存数', value: '45', color: primaryPink },
        { label: 'フォロワー', value: '12', color: '#10B981' }
    ];

    const recentInterests = [
        { id: 's1', name: '山本 恒一', univ: '香川大学', time: '10分前' },
        { id: 's2', name: '佐藤 未来', univ: '高松大学', time: '1時間前' },
    ];

    return (
        <div style={{ ...styles.appContainer, backgroundColor: '#F8FAFC' }}>
            <header style={{
                padding: '1.25rem 1.5rem', backgroundColor: '#FFFFFF', borderBottom: `1px solid ${borderLight}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100
            }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>株式会社タダノ</h2>
                    <p style={{ fontSize: '0.75rem', color: textSecondary, margin: 0 }}>管理ダッシュボード</p>
                </div>
                <button onClick={onLogout} style={{ ...styles.button, backgroundColor: '#F1F5F9', color: textSecondary, padding: '0.5rem 1rem' }}>ログアウト</button>
            </header>

            <main style={{ padding: '1.5rem 1.5rem 120px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {stats.map(s => (
                        <div key={s.label} style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '24px', textAlign: 'center', border: `1px solid ${borderLight}` }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: textSecondary }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Section: Recent Interests */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>最近のアクセス</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentInterests.map(student => (
                            <div 
                                key={student.id} 
                                style={{ ...styles.listItem, margin: 0, cursor: 'pointer' }}
                                onClick={() => onViewStudent(student.id)}
                            >
                                <div style={{ ...styles.avatar, background: `${primaryBlue}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primaryBlue, fontWeight: '900' }}>
                                    {student.name[0]}
                                </div>
                                <div style={styles.listInfo}>
                                    <p style={styles.listTitle}>{student.name}</p>
                                    <p style={styles.listSubtitle}>{student.univ} ・ {student.time}</p>
                                </div>
                                <div style={{ color: textSecondary }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};
