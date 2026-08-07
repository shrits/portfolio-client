import { memo } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { getRelativeTime } from '../../utils/formatters';

function FeedPost({ post, postRef }) {
  const timeAgo = getRelativeTime(post.createdAt);

  // Parse caption to style hashtags
  const renderCaption = (text) => {
    if (!text) return null;
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, i) =>
      part.startsWith('#') ? (
        <span key={i} className="ig-hashtag">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const aspectStyle =
    post.aspectRatio === '4:5'
      ? { paddingBottom: '125%' }
      : { paddingBottom: '100%' };

  return (
    <article
      ref={postRef}
      className="feed-post theme-transition"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-primary)',
        marginBottom: 'var(--space-base)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Post Header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: 'var(--space-md) var(--space-base)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
          <div
            className="rounded-full overflow-hidden shrink-0"
            style={{
              width: '34px',
              height: '34px',
              border: '1px solid var(--border-primary)',
            }}
          >
            <img
              src="https://pub-1c7a197468ca49d6b541fb3e666ada3c.r2.dev/IMG_4612.JPG"
              alt="Profile"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
              <span className="ig-username" style={{ fontSize: '13px' }}>shrits</span>
              {post.location && (
                <>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>•</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          aria-label="More options"
          className="rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150 p-1"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative w-full overflow-hidden" style={{ ...aspectStyle, backgroundColor: 'var(--surface-tertiary)' }}>
        <img
          src={post.imageUrl}
          alt={post.caption?.substring(0, 80) || 'Post image'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Action Bar */}
      <div
        className="flex items-center justify-between"
        style={{ padding: 'var(--space-md) var(--space-base) var(--space-sm)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-base)' }}>
          {[
            { icon: Heart, label: 'Like', size: 24 },
            { icon: MessageCircle, label: 'Comment', size: 24 },
            { icon: Send, label: 'Share', size: 22 },
          ].map(({ icon: Icon, label, size }) => (
            <button
              key={label}
              aria-label={label}
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform duration-150"
            >
              <Icon size={size} strokeWidth={1.75} />
            </button>
          ))}
        </div>
        <button
          aria-label="Bookmark"
          className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] hover:scale-110 active:scale-95 transition-transform duration-150"
        >
          <Bookmark size={24} strokeWidth={1.75} />
        </button>
      </div>

      {/* Likes Count */}
      <div style={{ padding: '0 var(--space-base) var(--space-xs)' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
          {(post.likesCount || 0).toLocaleString()} likes
        </span>
      </div>

      {/* Caption */}
      <div style={{ padding: '0 var(--space-base) var(--space-xs)' }}>
        <p style={{ fontSize: '14px', lineHeight: 1.5 }}>
          <span className="ig-username" style={{ marginRight: 'var(--space-sm)' }}>shrits</span>
          {renderCaption(post.caption)}
        </p>
      </div>

      {/* Comments Count */}
      {post.commentsCount > 0 && (
        <div style={{ padding: '0 var(--space-base) var(--space-xs)' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            View all {post.commentsCount} comments
          </span>
        </div>
      )}

      {/* Timestamp */}
      <div style={{ padding: '0 var(--space-base) var(--space-base)' }}>
        <time className="ig-timestamp">{timeAgo}</time>
      </div>
    </article>
  );
}

export default memo(FeedPost);
