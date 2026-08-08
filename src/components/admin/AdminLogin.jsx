import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';
import { Loader2 } from 'lucide-react';
import CatLogo from '../shared/CatLogo';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await adminLogin({ username, password });
      login(data.token, data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-md) var(--space-base)',
    border: '1.5px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--surface-secondary)',
    outline: 'none',
    fontSize: '14px',
    color: 'var(--text-primary)',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--surface-primary)' }}
    >
      <div className="animate-fade-in-up" style={{ width: '380px', padding: 'var(--space-base)' }}>
        {/* Login Card */}
        <div
          className="theme-transition"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Gradient accent */}
          <div style={{ height: '3px', background: 'var(--accent-gradient)' }} />

          <div style={{ padding: 'var(--space-xl) var(--space-xl) var(--space-lg)' }}>
            {/* Logo */}
            <div className="flex justify-center" style={{ marginBottom: 'var(--space-xl)' }}>
              <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
                <CatLogo size={28} />
                <span
                  className="text-gradient"
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                  }}
                >
                  Admin Login
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
            >
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
              />

              {error && (
                <p style={{ fontSize: '13px', textAlign: 'center', color: 'var(--error)' }}>
                  {error}
                </p>
              )}

              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                className="btn-gradient w-full flex items-center justify-center"
                style={{
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  gap: 'var(--space-sm)',
                  marginTop: 'var(--space-xs)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
