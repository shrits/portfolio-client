import { useEffect } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
} from 'lucide-react';
import { getRelativeTime } from '../../utils/formatters';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export default function PostModal({ post, isOpen, onClose }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const timeAgo = getRelativeTime(post.createdAt);

  const renderCaption = (text) => {
    if (!text) return null;
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, i) =>
      part.startsWith('#') ? (
        <span key={i} className="ig-hashtag">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: 'translateZ(0)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 z-10 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 p-2"
      >
        <X size={22} />
      </button>

      {/* Modal content */}
      <div
        className="animate-scale-in flex"
        style={{
          maxWidth: '1100px',
          maxHeight: '90vh',
          width: '95vw',
          backgroundColor: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image side */}
        <div
          className="relative shrink-0"
          style={{
            flex: '1 1 60%',
            maxWidth: '65%',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={getOptimizedImageUrl(post.imageUrl, { width: 1200, quality: 85 })}
            alt={post.caption?.substring(0, 80) || 'Post image'}
            decoding="async"
            referrerPolicy="no-referrer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxHeight: '90vh',
            }}
          />
        </div>

        {/* Details side */}
        <div
          className="flex flex-col"
          style={{
            flex: '1 1 40%',
            minWidth: '280px',
            maxWidth: '400px',
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center shrink-0"
            style={{
              padding: 'var(--space-base)',
              borderBottom: '1px solid var(--border-primary)',
              gap: 'var(--space-md)',
            }}
          >
            <div
              className="rounded-full overflow-hidden shrink-0"
              style={{
                width: '36px',
                height: '36px',
                border: '1px solid var(--border-primary)',
              }}
            >
              <img
                src={getOptimizedImageUrl('https://pub-1c7a197468ca49d6b541fb3e666ada3c.r2.dev/IMG_4612.JPG', { width: 100, quality: 80 })}
                alt="Profile"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                  shrits
                </span>
                {post.location && (
                  <>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>•</span>
                    <span
                      className="flex items-center"
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        gap: '3px',
                      }}
                    >
                      <MapPin size={11} />
                      {post.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Caption / comments area (scrollable) */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ padding: 'var(--space-base)' }}
          >
            {/* Caption */}
            <div className="flex" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <div
                className="rounded-full overflow-hidden shrink-0"
                style={{
                  width: '32px',
                  height: '32px',
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
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  <span style={{ fontWeight: 600, marginRight: 'var(--space-sm)' }}>shrits</span>
                  {renderCaption(post.caption)}
                </p>
                <time
                  className="ig-timestamp"
                  style={{ display: 'block', marginTop: 'var(--space-sm)' }}
                >
                  {timeAgo}
                </time>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div
            className="shrink-0"
            style={{ borderTop: '1px solid var(--border-primary)' }}
          >
            <div
              className="flex items-center justify-between"
              style={{ padding: 'var(--space-md) var(--space-base)' }}
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
                    style={{
                      color: 'var(--text-primary)',
                      transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent-primary)';
                      e.currentTarget.style.transform = 'scale(1.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Icon size={size} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
              <button
                aria-label="Bookmark"
                style={{
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'scale(1.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Bookmark size={24} strokeWidth={1.75} />
              </button>
            </div>

            {/* Stats */}
            <div style={{ padding: '0 var(--space-base) var(--space-md)' }}>
              <div
                className="flex items-center"
                style={{
                  gap: 'var(--space-lg)',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                  {post.likesCount.toLocaleString()} likes
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {post.commentsCount.toLocaleString()} comments
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {post.sharesCount.toLocaleString()} shares
                </span>
              </div>
              <time className="ig-timestamp">{timeAgo}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
