const TOKEN_KEY = 'planny_token';
const DEMO_TOKEN = 'demo';

export const auth = {
  login: (email: string, password: string): boolean => {
    // Fake auth - any email/password works
    if (email && password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, DEMO_TOKEN);
      }
      return true;
    }
    return false;
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY) === DEMO_TOKEN;
    }
    return false;
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
};
