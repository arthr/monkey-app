// modules/auth/hooks/useAuth.js
import { useContext, useMemo } from 'react';
import AuthContext from '../../contexts/AuthContext';

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
    }

    const { user, loading, login, logout } = context;

    const isLogged = useMemo(() => !!user, [user]);
    const username = useMemo(() => user?.username || '', [user]);
    // TODO: Implementar RBAC (Role-Based Access Control) ou ) ou ABAC (Attribute-Based Access Control) para controle de acesso mais granular
    const isAdmin = useMemo(() => user?.role === 'admin', [user]);
    const role = useMemo(() => user?.role || '', [user]);

    return {
        user,
        username,
        loading,
        login,
        logout,
        isLogged,
        isAdmin,
        role,
    };
}
