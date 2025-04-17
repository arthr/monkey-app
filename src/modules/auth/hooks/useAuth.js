import { useContext, useMemo } from 'react';
import AuthContext from '../../contexts/AuthContext';

export default function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
    }

    const { user, loading, login, logout, isLogged } = context;

    const username = useMemo(() => user?.profile?.preferred_username || user?.profile?.email || '', [user]);
    const email = useMemo(() => user?.profile?.email || '', [user]);
    const role = useMemo(() => user?.profile?.role || '', [user]);
    const isAdmin = useMemo(() => role === 'admin', [role]);

    return {
        user,
        username,
        email,
        role,
        isAdmin,
        loading,
        isLogged,
        login,
        logout,
    };
}
