import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authApi, type LoginRequest, type RegisterRequest } from '../api/authApi';
import { tokenStore } from '../auth/tokenStore';
import type { User } from '../types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  const logout = useCallback(async () => {
    try {
      await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
    } catch {

    }
    tokenStore.set(null);
    setUser(null);
  }, []);



  useEffect(() => {
    axios
      .post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
      .then(async (res) => {
        tokenStore.set(res.data.accessToken);
        const me = await authApi.me();
        setUser(me);
      })
      .catch(() => {
        tokenStore.set(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => {
      tokenStore.set(null);
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []);

  const login = useCallback(async (body: LoginRequest) => {
    setIsLoading(true);
    try {
      const { accessToken } = await authApi.login(body);
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

  const value: AuthContextValue = { user, isAuthenticated: !!user, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}