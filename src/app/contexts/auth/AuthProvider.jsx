import React, { useState, useEffect } from 'react';
import authStorage from '../../../services/storage/authStorage';
import authService from '../../services/authService';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authStorage.getToken()) {
                    const storedUsername = authStorage.getUsername();
                    if (storedUsername) {
                        const userData = { username: storedUsername };
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                authStorage.clearAll();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        console.log('Login bem-sucedido, dados recebidos:', result);

        authStorage.setUsername(credentials.username);
        authStorage.setToken(result.token);

        setUser(result.user);
        return result;
    };

    const logout = () => {
        authStorage.clearAll();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
} 