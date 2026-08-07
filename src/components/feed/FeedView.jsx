import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../../context/PostsContext';
import FeedPost from './FeedPost';

export default function FeedView() {
  const { posts, loading } = usePosts();
  const [searchParams] = useSearchParams();
  const postRefs = useRef({});

  const scrollToId = searchParams.get('scrollTo');

  // Scroll to target post when data loads
  useEffect(() => {
    if (!loading && scrollToId && postRefs.current[scrollToId]) {
      setTimeout(() => {
        postRefs.current[scrollToId].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [loading, scrollToId]);

  const setPostRef = useCallback((id) => (el) => {
    if (el) postRefs.current[id] = el;
  }, []);

  if (loading) {
    return (
      <div
        className="mx-auto"
        style={{
          maxWidth: 'var(--feed-max-width)',
          padding: 'var(--space-base) var(--space-base)',
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="theme-transition"
            style={{
              marginBottom: 'var(--space-base)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-primary)',
              overflow: 'hidden',
              padding: 'var(--space-base)',
            }}
          >
            <div className="flex items-center mb-3" style={{ gap: 'var(--space-md)' }}>
              <div className="skeleton rounded-full" style={{ width: '34px', height: '34px' }} />
              <div className="skeleton" style={{ width: '120px', height: '14px' }} />
            </div>
            <div
              className="skeleton w-full"
              style={{ paddingBottom: '100%', borderRadius: 'var(--radius-md)' }}
            />
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div className="skeleton" style={{ width: '80px', height: '14px' }} />
              <div className="skeleton" style={{ width: '100%', height: '14px' }} />
              <div className="skeleton" style={{ width: '60%', height: '14px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: 'var(--feed-max-width)',
        padding: 'var(--space-base)',
      }}
    >
      {posts.map((post) => (
        <FeedPost
          key={post._id}
          post={post}
          postRef={setPostRef(post._id)}
        />
      ))}

      {posts.length === 0 && (
        <div className="text-center" style={{ padding: 'var(--space-3xl) 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No posts yet.</p>
        </div>
      )}
    </div>
  );
}
