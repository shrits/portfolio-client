import { useState, useEffect } from 'react';
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
import { useMediaQuery } from '../../hooks/useMediaQuery';

const PROFILE_IMAGE_URL = 'https://pub-1c7a197468ca49d6b541fb3e666ada3c.r2.dev/IMG_4612.JPG';

export default function PostModal({ post, isOpen, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [highResLoaded, setHighResLoaded] = useState(false);

  // Reset loaded state on new post
  useEffect(() => {
    setHighResLoaded(false);
  }, [post?._id]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = originalOverflow;
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

  const previewThumbnailUrl = getOptimizedImageUrl(post.imageUrl, { width: 450, quality: 75 });
  const fullImageUrl = getOptimizedImageUrl(post.imageUrl, {
    width: isDesktop ? 1000 : 750,
    quality: 78,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transform: 'translateZ(0)',
        padding: isDesktop ? 'var(--space-xl)' : 'var(--space-sm)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Desktop Close button */}
      {isDesktop && (
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="fixed top-5 right-5 z-50 rounded-full text-white/80 hover:text-white bg-black/50 hover:bg-black/80 transition-all duration-150 p-2.5 backdrop-blur-md cursor-pointer"
          style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
        >
          <X size={22} />
        </button>
      )}

      {/* Modal Container */}
      {!isDesktop ? (
        /* Mobile: Top-and-Bottom Stacked Layout */
        <div
          className="animate-scale-in flex flex-col w-full"
          style={{
            maxWidth: '480px',
            maxHeight: '92vh',
            backgroundColor: 'var(--surface-elevated)',
            borderRadius: 'var(--radius-xl)',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            border: '1px solid var(--border-primary)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{
              padding: 'var(--space-md) var(--space-base)',
              borderBottom: '1px solid var(--border-primary)',
            }}
          >
            <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
              <div
                className="rounded-full overflow-hidden shrink-0"
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <img
                  src={getOptimizedImageUrl(PROFILE_IMAGE_URL, { width: 100, quality: 80 })}
                  alt="Profile"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center" style={{ gap: 'var(--space-xs)' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                    shrits
                  </span>
                  {post.location && (
                    <>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>•</span>
                      <span
                        className="flex items-center truncate"
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          gap: '3px',
                        }}
                      >
                        <MapPin size={11} className="shrink-0" />
                        {post.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Image (Prominent & Full Width on Top with Progressive Blur-up) */}
          <div
            className="relative w-full bg-black flex items-center justify-center shrink-0 overflow-hidden"
            style={{
              maxHeight: '58vh',
              minHeight: '260px',
            }}
          >
            {/* Low-res instant blur placeholder */}
            {!highResLoaded && (
              <img
                src={previewThumbnailUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain filter blur-md scale-105 opacity-60 pointer-events-none"
              />
            )}

            {/* High-res image */}
            <img
              src={fullImageUrl}
              alt={post.caption?.substring(0, 80) || 'Post image'}
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setHighResLoaded(true)}
              className={`relative z-10 w-full h-auto object-contain transition-opacity duration-300 ${
                highResLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ maxHeight: '58vh' }}
            />
          </div>

          {/* Mobile Details & Actions (Bottom) */}
          <div
            className="flex flex-col flex-1"
            style={{ padding: 'var(--space-md) var(--space-base)' }}
          >
            {/* Action buttons */}
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 'var(--space-sm)' }}
            >
              <div className="flex items-center" style={{ gap: 'var(--space-lg)' }}>
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
                    className="cursor-pointer active:scale-90"
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
                className="cursor-pointer active:scale-90"
              >
                <Bookmark size={24} strokeWidth={1.75} />
              </button>
            </div>

            {/* Likes count */}
            <div style={{ marginBottom: 'var(--space-xs)' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                {post.likesCount.toLocaleString()} likes
              </span>
            </div>

            {/* Caption */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                <span style={{ fontWeight: 600, marginRight: 'var(--space-sm)' }}>shrits</span>
                {renderCaption(post.caption)}
              </p>
            </div>

            {/* Stats & Timestamp */}
            <div
              className="flex items-center justify-between pt-2.5"
              style={{ borderTop: '1px solid var(--border-primary)' }}
            >
              <div className="flex items-center text-xs" style={{ gap: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                <span>{post.commentsCount.toLocaleString()} comments</span>
                <span>•</span>
                <span>{post.sharesCount.toLocaleString()} shares</span>
              </div>
              <time className="ig-timestamp">{timeAgo}</time>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: Side-by-Side Layout */
        <div
          className="animate-scale-in flex"
          style={{
            maxWidth: '1050px',
            maxHeight: '90vh',
            width: '92vw',
            backgroundColor: 'var(--surface-elevated)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-primary)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Desktop Image Side with Progressive Blur-up */}
          <div
            className="relative shrink-0 overflow-hidden"
            style={{
              flex: '1 1 60%',
              maxWidth: '65%',
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Low-res instant blur placeholder */}
            {!highResLoaded && (
              <img
                src={previewThumbnailUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain filter blur-md scale-105 opacity-60 pointer-events-none"
              />
            )}

            {/* High-res image */}
            <img
              src={fullImageUrl}
              alt={post.caption?.substring(0, 80) || 'Post image'}
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setHighResLoaded(true)}
              className={`relative z-10 w-full h-full object-contain transition-opacity duration-300 ${
                highResLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                maxHeight: '90vh',
              }}
            />
          </div>

          {/* Desktop Details Side */}
          <div
            className="flex flex-col"
            style={{
              flex: '1 1 40%',
              minWidth: '300px',
              maxWidth: '420px',
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
                  src={getOptimizedImageUrl(PROFILE_IMAGE_URL, { width: 100, quality: 80 })}
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

            {/* Caption / scrollable area */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: 'var(--space-base)' }}
            >
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
                    src={getOptimizedImageUrl(PROFILE_IMAGE_URL, { width: 100, quality: 80 })}
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

            {/* Action bar & Stats */}
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
      )}
    </div>
  );
}
