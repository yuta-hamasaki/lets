
import React from 'react';
import { styles, borderLight, textPrimary, textSecondary, primaryBlue } from '../styles';

type PrivacySettingsPageProps = {
    settings: any;
    setSettings: (settings: any) => void;
    onBack: () => void;
};

export const PrivacySettingsPage: React.FC<PrivacySettingsPageProps> = ({ settings, setSettings, onBack }) => {
    const toggleSetting = (key: string) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const SettingItem = ({ icon, title, desc, active, onClick }: any) => (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '24px', 
            marginBottom: '1rem', border: `1px solid ${borderLight}`
        }}>
            <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <div style={{ color: active ? primaryBlue : textSecondary, marginTop: '2px' }}>{icon}</div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: textPrimary }}>{title}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: textSecondary, lineHeight: '1.4' }}>{desc}</p>
                </div>
            </div>
            <button 
                onClick={onClick}
                style={{
                    width: '52px', height: '30px', borderRadius: '15px', border: 'none',
                    backgroundColor: active ? primaryBlue : '#E2E8F0',
                    position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s'
                }}
            >
                <div style={{
                    position: 'absolute', top: '3px', 
                    left: active ? '25px' : '3px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: '#FFFFFF', transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}></div>
            </button>
        </div>
    );

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
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 auto 0 0.5rem' }}>プライバシーとセキュリティ</h2>
            </header>

            <main style={{ padding: '1.5rem 1.25rem 120px' }}>
                <section style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: textSecondary, fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>公開範囲の設定</h3>
                    <SettingItem 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>}
                        title="プロフィールを全ユーザーに公開"
                        desc="OFFにすると、フォローしている人だけがあなたの詳細を見ることができます。"
                        active={settings.profilePublic}
                        onClick={() => toggleSetting('profilePublic')}
                    />
                    <SettingItem 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>}
                        title="大学名を公開"
                        desc="キャンパスウォールや検索結果で大学名が表示されます。"
                        active={settings.showUniversity}
                        onClick={() => toggleSetting('showUniversity')}
                    />
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: textSecondary, fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>企業とのつながり</h3>
                    <SettingItem 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                        title="企業からのスカウトを受け取る"
                        desc="ONにすると、あなたのプロフィールに基づいた特別なオファーが届きます。"
                        active={settings.allowCompanyScout}
                        onClick={() => toggleSetting('allowCompanyScout')}
                    />
                </section>

                <section>
                    <h3 style={{ fontSize: '0.9rem', color: textSecondary, fontWeight: '800', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>高度なセキュリティ</h3>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '24px', border: `1px solid ${borderLight}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>二段階認証</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: textSecondary }}>未設定（推奨）</p>
                            </div>
                            <button style={{ ...styles.button, backgroundColor: primaryBlue, color: '#FFFFFF', fontSize: '0.75rem' }}>設定する</button>
                        </div>
                        <div style={{ borderTop: `1px solid ${borderLight}`, paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>ログイン履歴</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: textSecondary }}>現在1台のデバイスでログイン中</p>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
