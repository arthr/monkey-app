import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import useLayout from './hooks/useLayout';
import useAuth from '../auth/hooks/useAuth';

function Default({ children }) {
    const { isMobile, sidebarCollapsed } = useLayout();
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col min-h-screen antialiased bg-gray-50 dark:bg-gray-900 dark:text-white">
            {/* Navbar */}
            <Navbar fixed={true} isAuthenticated={isAuthenticated} />
            {/* Sidebar */}
            <Sidebar isCollapsed={sidebarCollapsed} />
            {/* Main Content */}
            <main className={`p-4 flex-1 transition-all duration-300 ${isMobile ? 'md:ml-64' : sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} pt-20`}>
                {children}
            </main>
            {/* Footer */}
            <footer className="bg-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">© 2025 Direta Capital. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Default;
