"use client"
import React from 'react';

type Post = {
  id: string;
  content: string;
  createdAt: string | Date;
  likes: any[] | number;
  replies: any[] | number;
  tags?: string[];
  author: {
    userId: string;      // 画面遷移用（ProfilePage の userId と一致）
    fullname: string;
    // schemaに avatar が無いので一旦 optional
    avatarUrl?: string | null;
  };
};

type PostCardProps = {
  post: Post;
  onViewProfile?: (userId: string) => void;
};

export const PostCard: React.FC<PostCardProps> = ({ post, onViewProfile }) => {
  const handleProfileClick = () => {
    if (onViewProfile && post.author?.userId) {
      onViewProfile(post.author.userId);
    }
  };

  const authorName = post.author?.fullname ?? 'Unknown';
  const likeCount = Array.isArray(post.likes) ? post.likes.length : (post.likes ?? 0);
  const commentCount = Array.isArray(post.replies) ? post.replies.length : (post.replies ?? 0);

  const timeLabel =
    typeof post.createdAt === 'string'
      ? new Date(post.createdAt).toLocaleString('ja-JP')
      : post.createdAt.toLocaleString('ja-JP');

  return (
    <article className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full bg-slate-200 bg-cover bg-center shrink-0 cursor-pointer transition-transform active:scale-95"
          style={{ backgroundImage: post.author?.avatarUrl ? `url(${post.author.avatarUrl})` : 'none' }}
          onClick={handleProfileClick}
          role="button"
          aria-label={`${authorName}のプロフィールを表示`}
        />
        <div className="flex flex-col cursor-pointer" onClick={handleProfileClick}>
          <div className="font-extrabold text-slate-800 text-base">{authorName}</div>
          <div className="text-[0.85rem] text-slate-400 mt-px">{timeLabel}</div>
        </div>
      </div>

      <p className="m-0 mb-4 text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1.5 bg-blue-50 text-primary-blue rounded-xl text-[0.85rem] font-bold">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center pt-3 border-t border-slate-50 gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-[0.9rem] font-semibold cursor-pointer">
          {/* heart */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span className="text-[0.9rem] font-bold">{likeCount}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[0.9rem] font-semibold cursor-pointer">
          {/* comment */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
          </svg>
          <span className="text-[0.9rem] font-bold">{commentCount}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[0.9rem] font-semibold cursor-pointer ml-auto">
          {/* share */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>
      </div>
    </article>
  );
};

export default PostCard;