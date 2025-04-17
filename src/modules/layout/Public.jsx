import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function Public() {
    return (
        <div className="flex flex-col min-h-screen antialiased bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            {/* <Navbar fixed={false} isAuthenticated={false} /> */}
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center mx-auto p-4">
                <Outlet />
            </main>
            {/* Footer */}
            <footer className="bg-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">© 2025 Direta Capital. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Public;
