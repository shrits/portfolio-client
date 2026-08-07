import { NavLink } from 'react-router-dom';
import { Home, Send, User } from 'lucide-react';

export default function MobileBottomNav({ onMessageClick }) {
  const linkStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-sm)',
    gap: '2px',
    position: 'relative',
  };

  const activeDot = {
    position: 'absolute',
    bottom: '0',
    width: '4px',
    height: '4px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--accent-gradient)',
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 glass flex items-center justify-around z-40"
      style={{
        height: 'var(--bottombar-height)',
        borderTop: '1px solid var(--border-primary)',
      }}
    >
      <NavLink
        to="/feed"
        id="mobile-nav-home"
        style={linkStyle}
      >
        {({ isActive }) => (
          <>
            <Home
              size={22}
              strokeWidth={isActive ? 2.25 : 1.75}
              style={{
                color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                transition: 'var(--transition-fast)',
              }}
            />
            {isActive && <span style={activeDot} />}
          </>
        )}
      </NavLink>

      <button
        id="mobile-nav-message"
        onClick={onMessageClick}
        style={linkStyle}
      >
        <Send
          size={22}
          strokeWidth={1.75}
          style={{ color: 'var(--text-primary)' }}
        />
      </button>

      <NavLink
        to="/profile"
        id="mobile-nav-profile"
        style={linkStyle}
      >
        {({ isActive }) => (
          <>
            <User
              size={22}
              strokeWidth={isActive ? 2.25 : 1.75}
              style={{
                color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                transition: 'var(--transition-fast)',
              }}
            />
            {isActive && <span style={activeDot} />}
          </>
        )}
      </NavLink>
    </nav>
  );
}
