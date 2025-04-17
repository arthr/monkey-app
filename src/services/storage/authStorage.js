const TOKEN_KEY = 'authToken';
const USERNAME_KEY = 'username';

const authStorage = {
    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    getToken: () => localStorage.getItem(TOKEN_KEY),
    clearToken: () => localStorage.removeItem(TOKEN_KEY),

    setUsername: (username) => localStorage.setItem(USERNAME_KEY, username),
    getUsername: () => localStorage.getItem(USERNAME_KEY),
    clearUsername: () => localStorage.removeItem(USERNAME_KEY),

    clearAll: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
    },
};

export default authStorage;
