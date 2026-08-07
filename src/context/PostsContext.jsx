import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getPosts } from '../services/api';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchPosts = useCallback(async (silent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!silent && posts.length === 0) {
      setLoading(true);
    }
    try {
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [posts.length]);

  // Initial load on app start
  useEffect(() => {
    fetchPosts(false);
  }, []);

  const refreshPosts = useCallback(() => {
    return fetchPosts(true);
  }, [fetchPosts]);

  return (
    <PostsContext.Provider value={{ posts, loading, error, refreshPosts, setPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
