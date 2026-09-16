import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Keyed on the path so each page mounts fresh and plays its entrance. */}
      <main key={pathname} className="flex-grow pt-16 page-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
