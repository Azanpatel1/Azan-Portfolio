import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Home', exact: true },
  { to: '/projects', label: 'Projects' },
  { to: '/internships', label: 'Internships' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-sm border-b transition-colors ${
        isScrolled ? 'border-ink-line' : 'border-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-8 h-8 border border-text flex items-center justify-center font-mono text-xs tracking-widest group-hover:border-accent group-hover:text-accent transition-colors">
            AP
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted group-hover:text-text transition-colors">
            Azan Patel
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#contact" className="btn btn-accent text-[11px] py-2 px-4">
            Contact
          </a>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-text"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-ink-line bg-ink">
          <nav className="container py-6 flex flex-col gap-4">
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
            <a href="#contact" className="btn btn-accent text-[11px] py-2 px-4 self-start mt-2">
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  exact?: boolean;
}

const NavItem = ({ to, label, exact }: NavItemProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {label}
    </Link>
  );
};

export default Header;
