import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-light bg-opacity-80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold">AP</span>
          </div>
          <span>Portfolio</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink to="/" exact>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
        </nav>
        
        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className="btn btn-accent text-sm"
          >
            Contact Me
          </a>
          
          <button className="block md:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  exact?: boolean;
}

const NavLink = ({ to, children, exact }: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to);
    
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

export default Header; 