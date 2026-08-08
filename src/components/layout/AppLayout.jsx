import { Outlet, Link } from 'react-router-dom';
import CatLogo from '../shared/CatLogo';
import ThemeToggle from '../shared/ThemeToggle';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--surface-primary)' }}>
      {/* Top Navbar */}
      <header
        className="sticky top-0 z-40 glass"
        style={{
          borderBottom: '1px solid var(--border-primary)',
          height: 'var(--topbar-height)',
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{
            maxWidth: '935px',
            margin: '0 auto',
            padding: '0 var(--space-lg)',
            width: '100%',
          }}
        >
          <Link to="/profile" className="flex items-center gap-2.5">
            <CatLogo size={24} />
            <span
              className="text-gradient font-bold"
              style={{
                fontSize: '19px',
                letterSpacing: '-0.5px',
              }}
            >
              Portfolio
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle size={18} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full" style={{ paddingBottom: 'var(--space-2xl)' }}>
        <Outlet />
      </main>
    </div>
  );
}
