import { NavLink } from 'react-router-dom';
import { Home, Send, User } from 'lucide-react';
import CatLogo from '../shared/CatLogo';
import ThemeToggle from '../shared/ThemeToggle';

export default function DesktopSidebar({ onMessageClick }) {
  const navItems = [
    { to: '/feed', icon: Home, label: 'Feed' },
    { action: 'message', icon: Send, label: 'Message' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40"
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--surface-elevated)',
        borderRight: '1px solid var(--border-primary)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: 'var(--space-xl) var(--space-lg) var(--space-lg)' }}>
        <NavLink to="/profile" className="flex items-center gap-3">
          <CatLogo size={26} />
          <span
            className="text-gradient"
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Portfolio
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1" style={{ padding: `var(--space-sm) var(--space-md)` }}>
        <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.action === 'message') {
              return (
                <button
                  key={item.label}
                  id={`nav-${item.label.toLowerCase()}`}
                  onClick={onMessageClick}
                  className="w-full flex items-center gap-4 rounded-xl text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-colors duration-150 p-3"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.75}
                    className="transition-transform duration-150"
                  />
                  <span style={{ fontSize: '15px', fontWeight: 400 }}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                id={`nav-${item.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl transition-colors duration-150 p-3 ${
                    isActive
                      ? 'bg-[var(--accent-soft)] font-semibold text-[var(--accent-primary)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--accent-soft)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.25 : 1.75}
                      style={{
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                      }}
                    />
                    <span style={{ fontSize: '15px' }}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Theme Toggle */}
      <div
        className="flex items-center gap-3"
        style={{
          padding: 'var(--space-lg)',
          borderTop: '1px solid var(--border-primary)',
        }}
      >
        <ThemeToggle size={18} />
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Theme
        </span>
      </div>
    </aside>
  );
}
