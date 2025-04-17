import React, { useState, useEffect } from 'react';
import LayoutContext from './LayoutContext';

function LayoutContextWrapper({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState ? JSON.parse(savedState) : window.innerWidth < 768;
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleThemeChange = (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
        };
    }, []);

    useEffect(() => {
        if (
            localStorage.getItem('flowbite-theme-mode') === 'dark' ||
            (!('flowbite-theme-mode' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && !sidebarCollapsed) {
                setSidebarCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarCollapsed]);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    const contextValue = {
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        isMobile,
    };

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
}

export function LayoutProvider({ children }) {
    return (
        <LayoutContextWrapper>
            {children}
        </LayoutContextWrapper>
    );
}
