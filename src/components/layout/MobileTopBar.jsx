import InstagramLogo from '../shared/InstagramLogo';
import ThemeToggle from '../shared/ThemeToggle';

export default function MobileTopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 glass flex items-center justify-between z-40"
      style={{
        height: 'var(--topbar-height)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 var(--space-base)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <InstagramLogo size={22} />
        <span
          className="text-gradient"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}
        >
          Portfolio
        </span>
      </div>
      <ThemeToggle size={16} />
    </header>
  );
}
