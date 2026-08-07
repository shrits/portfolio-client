import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import { getPosts, createPost, updatePost, deletePost } from '../../services/api';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import PostForm from './PostForm';
import MessagesInbox from './MessagesInbox';
import {
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Image,
  Mail,
  Loader2,
} from 'lucide-react';
import InstagramLogo from '../shared/InstagramLogo';

export default function AdminDashboard() {
  const { isAuthenticated, username, logout } = useAuth();
  const { refreshPosts } = usePosts();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchPosts();
  }, [isAuthenticated, navigate]);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (data) => {
    await createPost(data);
    setShowForm(false);
    fetchPosts();
    refreshPosts();
  };

  const handleUpdatePost = async (data) => {
    await updatePost(editingPost._id, data);
    setEditingPost(null);
    setShowForm(false);
    fetchPosts();
    refreshPosts();
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      fetchPosts();
      refreshPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const startEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  if (!isAuthenticated) return null;

  const tabStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-base)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 500,
    background: isActive ? 'var(--accent-gradient)' : 'var(--surface-tertiary)',
    color: isActive ? 'white' : 'var(--text-primary)',
    border: isActive ? 'none' : '1px solid var(--border-primary)',
    transition: 'var(--transition-base)',
    cursor: 'pointer',
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-primary)' }}>
      {/* Admin Top Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between theme-transition"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border-primary)',
          padding: 'var(--space-md) var(--space-lg)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
          <InstagramLogo size={22} />
          <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
            Admin Dashboard
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-base)' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {username}
          </span>
          <button
            id="admin-logout"
            onClick={handleLogout}
            className="flex items-center rounded-lg"
            style={{
              gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-md)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--error)',
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        {/* Tab Navigation */}
        <div className="flex" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          <button
            onClick={() => { setActiveTab('posts'); setShowForm(false); setEditingPost(null); }}
            style={tabStyle(activeTab === 'posts')}
          >
            <Image size={16} />
            Posts ({posts.length})
          </button>
          <button
            onClick={() => { setActiveTab('messages'); setShowForm(false); setEditingPost(null); }}
            style={tabStyle(activeTab === 'messages')}
          >
            <Mail size={16} />
            Messages
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            {!showForm && (
              <>
                <button
                  id="admin-new-post"
                  onClick={() => { setShowForm(true); setEditingPost(null); }}
                  className="group flex items-center overflow-hidden theme-transition"
                  title="New Post"
                  style={{
                    height: '40px',
                    padding: '0 11px',
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-base)',
                    boxShadow: 'var(--shadow-xs)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                >
                  <Plus
                    size={18}
                    className="shrink-0 transition-transform duration-300 group-hover:rotate-90"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <span
                    className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    New Post
                  </span>
                </button>

                {loading ? (
                  <div className="flex justify-center" style={{ padding: 'var(--space-3xl)' }}>
                    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {(Array.isArray(posts) ? posts : []).map((post) => (
                      <div
                        key={post._id}
                        className="flex items-center theme-transition"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          padding: 'var(--space-md)',
                          gap: 'var(--space-base)',
                          transition: 'var(--transition-base)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <img
                          src={getOptimizedImageUrl(post.imageUrl, { width: 120, quality: 75 })}
                          alt="Thumbnail"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="shrink-0 object-cover"
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }} className="truncate">
                            {post.caption.substring(0, 80)}
                          </p>
                          <div className="flex" style={{ gap: 'var(--space-base)', marginTop: 'var(--space-xs)' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              ❤️ {post.likesCount}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              💬 {post.commentsCount}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              📤 {post.sharesCount}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0" style={{ gap: 'var(--space-xs)' }}>
                          <button
                            onClick={() => startEdit(post)}
                            className="rounded-lg"
                            title="Edit post"
                            style={{
                              padding: 'var(--space-sm)',
                              color: 'var(--text-secondary)',
                              transition: 'var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--accent-soft)';
                              e.currentTarget.style.color = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="rounded-lg"
                            title="Delete post"
                            style={{
                              padding: 'var(--space-sm)',
                              color: 'var(--text-secondary)',
                              transition: 'var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                              e.currentTarget.style.color = 'var(--error)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {showForm && (
              <div
                className="theme-transition"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                  padding: 'var(--space-lg)',
                }}
              >
                <h2 style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)', marginBottom: 'var(--space-base)' }}>
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <PostForm
                  initialData={editingPost}
                  onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                  onCancel={cancelForm}
                  isEditing={!!editingPost}
                />
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && <MessagesInbox />}
      </div>
    </div>
  );
}
