import useTheme from '../../hooks/useTheme';

const iconClass = (visible: boolean, turn: string) =>
  `absolute w-4 h-4 transition-[opacity,transform] duration-300 ease-house motion-reduce:transition-none ${
    visible ? 'opacity-100 rotate-0 scale-100' : `opacity-0 ${turn} scale-75`
  }`;

/**
 * Light/dark switch. Both glyphs stay mounted and cross-fade with a quarter
 * turn, so the swap reads as one control changing state rather than two icons.
 * The label names the action, so it carries no pressed state; the ::before
 * widens the 32px square to a 44px hit area without changing what is drawn.
 */
const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className={`relative w-8 h-8 inline-flex items-center justify-center border border-ink-line text-text-muted hover:border-accent hover:text-accent transition-colors before:absolute before:-inset-1.5 before:content-[''] ${className}`}
    >
      {/* Sun: shown on the dark theme, offering light. */}
      <svg
        aria-hidden="true"
        className={iconClass(!isLight, '-rotate-90')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="12" cy="12" r="3.5" />
        <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
      </svg>
      {/* Moon: shown on the light theme, offering dark. */}
      <svg
        aria-hidden="true"
        className={iconClass(isLight, 'rotate-90')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
