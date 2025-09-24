import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Newsletter from './Newsletter';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Pular para o conteúdo
      </a>
      
      <Header />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Outlet />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Layout;