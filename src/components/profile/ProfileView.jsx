import { usePosts } from '../../context/PostsContext';
import ProfileHeader from './ProfileHeader';
import ProfileGrid from './ProfileGrid';

export default function ProfileView({ onMessageClick }) {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div style={{ maxWidth: '935px', margin: '0 auto', padding: 'var(--space-xl) var(--space-lg)' }}>
        {/* Skeleton header */}
        <div className="flex items-center mb-8" style={{ gap: 'var(--space-3xl)' }}>
          <div
            className="skeleton rounded-full"
            style={{ width: '150px', height: '150px', flexShrink: 0 }}
          />
          <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="skeleton" style={{ width: '200px', height: '24px' }} />
            <div className="skeleton" style={{ width: '300px', height: '18px' }} />
            <div className="skeleton" style={{ width: '250px', height: '18px' }} />
          </div>
        </div>
        {/* Skeleton grid */}
        <div className="grid grid-cols-3 gap-[3px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileHeader postCount={Array.isArray(posts) ? posts.length : 0} onMessageClick={onMessageClick} />
      <ProfileGrid posts={posts} />
    </div>
  );
}
