import { useState, useCallback } from 'react';
import { Grid3X3, Heart, MessageCircle } from 'lucide-react';
import PostModal from './PostModal';
import { formatCount } from '../../utils/formatters';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export default function ProfileGrid({ posts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  const openPost = useCallback((post) => setSelectedPost(post), []);
  const closePost = useCallback(() => setSelectedPost(null), []);

  const prefetchPostImage = useCallback((imageUrl) => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = getOptimizedImageUrl(imageUrl, { width: 1000, quality: 78 });
  }, []);

  const postList = Array.isArray(posts) ? posts : [];

  return (
    <div
      className="animate-fade-in"
      style={{ maxWidth: '935px', margin: '0 auto' }}
    >
      {/* Tab bar */}
      <div
        className="flex justify-center"
        style={{ borderTop: '1px solid var(--border-primary)' }}
      >
        <button
          className="flex items-center py-3 px-4 text-xs font-semibold uppercase tracking-wider"
          style={{
            borderTop: '2px solid var(--accent-primary)',
            marginTop: '-1px',
            color: 'var(--text-primary)',
            letterSpacing: '1.5px',
            gap: 'var(--space-sm)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <Grid3X3 size={34} style={{ color: 'var(--accent-primary)' }} />
          Posts
        </button>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-3 gap-[3px]"
        style={{ maxWidth: '935px' }}
      >
        {postList.map((post, index) => (
          <div
            key={post._id}
            role="button"
            tabIndex={0}
            aria-label={post.caption ? `View post: ${post.caption.substring(0, 40)}` : 'View post'}
            className="grid-item relative cursor-pointer aspect-square overflow-hidden bg-[var(--surface-tertiary)]"
            style={{ borderRadius: '2px' }}
            onClick={() => openPost(post)}
            onMouseEnter={() => prefetchPostImage(post.imageUrl)}
            onTouchStart={() => prefetchPostImage(post.imageUrl)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPost(post);
              }
            }}
          >
            <img
              src={getOptimizedImageUrl(post.imageUrl, { width: 450, quality: 75 })}
              alt={post.caption?.substring(0, 50) || 'Post'}
              loading={index < 6 ? 'eager' : 'lazy'}
              fetchPriority={index < 3 ? 'high' : 'auto'}
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grid-img"
            />
            <div className="grid-item-overlay">
              <span>
                <Heart size={18} fill="white" />
                {formatCount(post.likesCount)}
              </span>
              <span>
                <MessageCircle size={18} fill="white" />
                {formatCount(post.commentsCount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Detail Modal */}
      <PostModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={closePost}
      />
    </div>
  );
}
