import { useEffect } from 'react';
import { X, BadgeCheck } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export default function ProfilePictureModal({ isOpen, onClose, imageUrl, username = 'shrits', fullName = 'Shritesh Santra (Soumo)' }) {
  // Handle ESC key and prevent body scrolling when modal is active
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fade-in"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: 'var(--space-lg)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged profile picture"
    >
      {/* Top action bar with close button */}
      <button
        onClick={onClose}
        aria-label="Close profile picture view"
        className="fixed top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <X size={24} />
      </button>

      {/* Main Avatar Container */}
      <div
        className="flex flex-col items-center animate-scale-in"
        style={{ maxWidth: '420px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enlarged Circular Image */}
        <div
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{
            width: 'clamp(240px, 60vw, 360px)',
            height: 'clamp(240px, 60vw, 360px)',
            border: '2.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 0, 0, 0.4)',
            backgroundColor: 'var(--surface-tertiary)',
          }}
        >
          <img
            src={getOptimizedImageUrl(imageUrl, { width: 800, quality: 90 })}
            alt={fullName}
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
