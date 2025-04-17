import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import useLayout from './hooks/useLayout';
import useAuth from '../auth/hooks/useAuth';

function Default({ children }) {
    const { isMobile, sidebarCollapsed } = useLayout();
    const { isAuthenticated } = useAuth();

    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
            {/* Navbar */}
            <Navbar isAuthenticated={isAuthenticated} />
            {/* Sidebar */}
            <Sidebar isCollapsed={sidebarCollapsed} />
            {/* Main Content */}
            <main className={`p-4 min-h-screen transition-all duration-300 ${isMobile ? 'md:ml-64' : sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} pt-20`}>
                {children}
            </main>
        </div>
    );
}

export default Default;
