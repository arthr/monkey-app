import React from 'react';
import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import AuthContext from './AuthContext';

const cognitoAuthConfig = {
    authority: import.meta.env.VITE_COGNITO_AUTHORITY, // https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID, // 13gpv07b7dqg8dg8lv900imup3
    redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin, // http://localhost:3000
    response_type: "code",
    scope: "email openid profile",
    onSigninCallback: () => window.history.replaceState({}, document.title, window.location.pathname),
    userStore: new WebStorageStateStore({ store: window.localStorage }),

    //post_logout_redirect_uri: import.meta.env.VITE_COGNITO_LOGOUT_URI || window.location.origin,
    //silent_redirect_uri: window.location.origin + "/silent-renew.html",
};

function AuthContextWrapper({ children }) {
    const oidc = useOidcAuth();

    const { user, isAuthenticated, isLoading, signIn, signOut } = oidc;

    const contextValue = {
        user,
        loading: isLoading,
        login: signIn,
        logout: signOut,
        isLogged: isAuthenticated,
        raw: oidc, // opcional: expor tudo do oidc se quiser mais flexibilidade
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }) {
    return (
        <OidcAuthProvider {...cognitoAuthConfig}>
            <AuthContextWrapper>{children}</AuthContextWrapper>
        </OidcAuthProvider>
    );
}
