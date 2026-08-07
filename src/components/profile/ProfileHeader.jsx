import { useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BadgeCheck } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import ProfilePictureModal from './ProfilePictureModal';

const PROFILE_IMAGE_URL = 'https://pub-1c7a197468ca49d6b541fb3e666ada3c.r2.dev/IMG_4612.JPG';

export default function ProfileHeader({ postCount, onMessageClick }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);

  return (
    <header
      className="animate-fade-in"
      style={{
        maxWidth: '935px',
        margin: '0 auto',
        padding: isDesktop
          ? 'var(--space-xl) var(--space-lg)'
          : 'var(--space-base)',
      }}
    >
      <div
        className="flex"
        style={{
          alignItems: isDesktop ? 'center' : 'flex-start',
          gap: isDesktop ? 'var(--space-3xl)' : 'var(--space-lg)',
        }}
      >
        {/* Profile Picture (clickable, opens enlarged view) */}
        <div
          role="button"
          tabIndex={0}
          aria-label="View enlarged profile picture"
          onClick={() => setIsPictureModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsPictureModalOpen(true);
            }
          }}
          className="shrink-0 rounded-full overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
          style={{
            width: isDesktop ? '150px' : '80px',
            height: isDesktop ? '150px' : '80px',
            border: '1px solid var(--border-primary)',
          }}
        >
          <img
            src={getOptimizedImageUrl(PROFILE_IMAGE_URL, { width: 300, quality: 85 })}
            alt="Profile"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:brightness-95"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          {/* Username row */}
          <div
            className="flex items-center flex-wrap"
            style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-base)' }}
          >
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 400,
                color: 'var(--text-primary)',
                letterSpacing: '-0.2px',
              }}
            >
              shrits
            </h1>
            <BadgeCheck
              size={18}
              style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)', stroke: 'var(--surface-primary)' }}
            />
            <button
              id="profile-message-btn"
              onClick={onMessageClick}
              className="btn-gradient rounded-lg"
              style={{
                padding: 'var(--space-sm) var(--space-base)',
                fontSize: '13px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Message
            </button>
          </div>

          {/* Stats row — desktop only */}
          {isDesktop && (
            <div
              className="flex"
              style={{ gap: 'var(--space-xl)', marginBottom: 'var(--space-base)' }}
            >
              {[
                { value: postCount, label: 'posts' },
                { value: '12.4k', label: 'followers' },
                { value: '342', label: 'following' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="theme-transition"
                  style={{
                    padding: 'var(--space-sm) var(--space-base)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border-secondary)',
                    textAlign: 'center',
                    transition: 'var(--transition-base)',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                    {stat.value}
                  </span>{' '}
                  <span style={{ fontWeight: 400, fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          <div style={{ lineHeight: 1.6 }}>
            <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
              Shritesh Santra (Soumo)
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Photographer • Content Creator
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: 'var(--space-sm)' }}>
              We are made of stories and my stories are made of food!
              <br />
              Without little things, there can be no big things ✨
              <br />
              Part time - Musician 🎸
              <br />
              Full time - Storyteller 📸

            </p>
          </div>
        </div>
      </div>

      {/* Stats row — mobile only */}
      {!isDesktop && (
        <div
          className="flex justify-around"
          style={{
            padding: 'var(--space-md) 0',
            marginTop: 'var(--space-base)',
            borderTop: '1px solid var(--border-primary)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          {[
            { value: postCount, label: 'posts' },
            { value: '12.4k', label: 'followers' },
            { value: '342', label: 'following' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlarged Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={isPictureModalOpen}
        onClose={() => setIsPictureModalOpen(false)}
        imageUrl={PROFILE_IMAGE_URL}
        username="shrits"
        fullName="Shritesh Santra (Soumo)"
      />
    </header>
  );
}
