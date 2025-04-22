import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../TopBar';
import Sidebar from '../Sidebar';
import FloatingSearch from '../FloatingSearch';
import TopContributors from '../news/TopContributors';
import CompanyNews from '../news/CompanyNews';
import CustomToaster from '../ui/CustomToaster';

export default function MainLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-design-greyBG">
      {/* Fixed TopBar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />
      </div>

      <div className="pt-16 flex">
        {/* Overlay for mobile when sidebar is open */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        <div className={`fixed top-16 h-[calc(100vh-4rem)] w-[280px] z-40 transition-transform duration-300 transform 
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0`}
        >
          <Sidebar
            isOpen={isMenuOpen}
            onToggle={toggleMenu}
            onClose={() => setIsMenuOpen(false)}
            navigate={navigate}
            currentPath={location.pathname}
          />
        </div>

        {/* Main Content Area */}
        <div className="w-full min-h-[calc(100vh-4rem)] transition-all duration-300
          lg:ml-[280px] lg:w-[calc(100%-280px)]
          xl:mr-[384px] xl:w-[calc(100%-664px)]"
        >
          <main className="p-4 lg:p-6">
            <div className="max-w-[1200px] mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block fixed right-0 top-16 w-96 h-[calc(100vh-4rem)] bg-design-greyBG overflow-y-auto p-6">
          <div className="space-y-6">
            <TopContributors />
            <CompanyNews />
          </div>
        </div>
      </div>

      <FloatingSearch navigate={navigate} />
      <CustomToaster />
    </div>
  );
}