import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { authApi, type LoginRequest, type RegisterRequest } from '../api/authApi';
import { decodeJwt, isExpired } from '../auth/jwt';
import { tokenStore } from '../auth/tokenStore';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [logout]);

  const login = useCallback(async (body: LoginRequest) => {
    setIsLoading(true);
    try {
      const { accessToken } = await authApi.login(body);
      const payload = decodeJwt(accessToken);
      if (!payload || isExpired(payload)) {
        throw new Error('Received an invalid or already-expired token');
      }
      tokenStore.set(accessToken);
      const me = await authApi.me();
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (body: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authApi.register(body);
      await login({ email: body.email, password: body.password });
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}