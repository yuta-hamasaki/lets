import React, { useState } from 'react';
import { styles } from '../styles';

type NewPostModalProps = {
    onClose: () => void;
    onSubmit: (post: { title: string; content: string; category: string; }) => void;
};

export const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('タイトルと内容を入力してください。');
            return;
        }
        onSubmit({ title, content, category: '' });
        onClose();
    };

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <header style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>新規トーク</h2>
                    <button style={styles.closeButton} onClick={onClose} aria-label="閉じる">&times;</button>
                </header>
                <form onSubmit={handleSubmit} style={styles.modalForm}>
                    <input
                        type="text"
                        placeholder="トピック・タイトル"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={styles.modalInput}
                        aria-label="トピック"
                    />
                    <textarea
                        placeholder="いま何してる？"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        style={{...styles.modalInput, ...styles.modalTextarea}}
                        aria-label="内容"
                    />
                    <button type="submit" style={{...styles.button, ...styles.signupButton}}>投稿する</button>
                </form>
            </div>
        </div>
    );
};
