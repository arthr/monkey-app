import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Sidebar,
    SidebarItem,
    SidebarItems,
    SidebarItemGroup,
} from 'flowbite-react';
import useLayout from '../hooks/useLayout'
import { FiDatabase } from "react-icons/fi";
import { BsFiletypeXml } from "react-icons/bs";

function SidebarComponent() {
    const { sidebarCollapsed } = useLayout();
    const location = useLocation();

    const pathname = location.pathname;

    return (
        <div
            className={`transition-all duration-300 fixed top-0 left-0 z-40 h-screen pt-14 ${sidebarCollapsed ? '-translate-x-full' : ''
                } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${sidebarCollapsed ? 'w-16' : 'w-64'
                }`}
        >
            <Sidebar
                aria-label="Menu de Navegação"
                collapsed={sidebarCollapsed}
                className="transition-all duration-300 h-full border-r border-gray-200 dark:border-gray-700"
            >
                <SidebarItems>
                    <SidebarItemGroup>
                        <SidebarItem
                            key={1}
                            as={Link}
                            to="/" // Caminho relativo gerenciado pelo React Router
                            icon={FiDatabase}
                            active={pathname === "/"}
                        >
                            Remessas
                        </SidebarItem>
                        <SidebarItem
                            key={2}
                            as={Link}
                            to="/nfe" // Caminho para o módulo NFe
                            icon={BsFiletypeXml}
                            active={pathname.startsWith("/nfe")}
                        >
                            NFe
                        </SidebarItem>
                    </SidebarItemGroup>
                </SidebarItems>
            </Sidebar>
        </div>
    );
}

export default SidebarComponent;
