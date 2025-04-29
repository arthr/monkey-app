import React from 'react';
import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import AuthContext from './AuthContext';

const cognitoAuthConfig = {
    authority: import.meta.env.VITE_COGNITO_AUTHORITY,
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin,
    response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE || "code",
    scope: import.meta.env.VITE_COGNITO_SCOPE || "email openid profile",
    post_logout_redirect_uri: import.meta.env.VITE_COGNITO_LOGOUT_URI || window.location.origin,
    //silent_redirect_uri: window.location.origin + "/silent-renew.html",
    onSigninCallback: () => window.history.replaceState({}, document.title, window.location.pathname),
    userStore: new WebStorageStateStore({ store: window.localStorage }),

};

function AuthContextWrapper({ children }) {
    const oidc = useOidcAuth();

    const { user, isAuthenticated, isLoading, signoutRedirect, signinRedirect } = oidc;

    const contextValue = {
        user,
        loading: isLoading,
        login: signinRedirect,
        logout: signoutRedirect,
        isLogged: isAuthenticated,
        raw: oidc, // opcional: expor tudo do oidc se quiser mais flexibilidade
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children, ...props }) {
    return (
        <OidcAuthProvider {...props} {...cognitoAuthConfig}>
            <AuthContextWrapper>{children}</AuthContextWrapper>
        </OidcAuthProvider>
    );
}
