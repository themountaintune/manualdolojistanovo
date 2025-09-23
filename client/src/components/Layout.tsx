import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Newsletter from './Newsletter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Layout;