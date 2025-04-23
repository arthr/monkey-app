import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import useLayout from './hooks/useLayout';
import useAuth from '../auth/hooks/useAuth';

function Private() {
    const { isMobile, sidebarCollapsed } = useLayout();
    const { isLogged } = useAuth();

    return (
        <div className="flex flex-col min-h-screen antialiased bg-gray-50 dark:bg-gray-900 dark:text-white">
            {/* Navbar */}
            <Navbar fixed={true} isAuthenticated={isLogged} />
            {/* Sidebar */}
            <Sidebar isCollapsed={sidebarCollapsed} />
            {/* Main Content */}
            <main className={`p-4 flex-1 transition-all duration-300 ${isMobile ? 'md:ml-64' : sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} pt-20`}>
                <Outlet />
            </main>
        </div>
    );
}

export default Private;
