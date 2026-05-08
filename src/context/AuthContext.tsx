import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthSession, clearAuthSession, loadAuthSession, saveAuthSession } from '../storage/authStorage';
import { validateLoginInput } from '../utils/loginValidation';

type AuthUser = {
  email: string;
};

type AuthContextValue = {
  hydrated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    loadAuthSession()
      .then((session) => {
        if (session) {
          setUser({ email: session.email });
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const issue = validateLoginInput(email, password);
    if (issue) {
      throw new Error(issue);
    }
    const session: AuthSession = {
      email: email.trim().toLowerCase(),
      token: `mock-${Date.now()}`,
    };
    await saveAuthSession(session);
    setUser({ email: session.email });
  }, []);

  const logout = useCallback(async () => {
    await clearAuthSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      hydrated,
      user,
      login,
      logout,
    }),
    [hydrated, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
