import useTheme from '../../hooks/useTheme';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Dark theme' : 'Light theme'}
      className={`w-8 h-8 inline-flex items-center justify-center border border-ink-line text-text-muted hover:border-accent hover:text-accent transition-colors ${className}`}
    >
      {isLight ? (
        // Moon
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      ) : (
        // Sun
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="3.5" />
          <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
