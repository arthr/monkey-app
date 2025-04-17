import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function Public() {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Navbar */}
            <Navbar isAuthenticated={false} />
            {/* Main Content */}
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Public;
