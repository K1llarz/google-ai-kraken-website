import React, { createContext, useContext, useEffect, useState } from 'react';
import { KEYS, readJSON, writeJSON } from '../lib/localStore';

/**
 * LOCAL auth — stand-in for Firebase Auth while running on the local backend.
 * Credentials are checked against the list below (override via Vite env vars
 * VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD). A session flag is kept in
 * localStorage. This is NOT secure (the password ships in the client bundle) —
 * it's only for local development. Restore the Firebase AuthContext for prod.
 */
const LOCAL_ADMINS: { email: string; password: string }[] = [
  {
    email: import.meta.env.VITE_ADMIN_EMAIL ?? 'bugashvilig@gmail.com',
    password: import.meta.env.VITE_ADMIN_PASSWORD ?? 'gvtiso1234',
  },
];

interface AdminUser {
  email: string;
}

interface AuthState {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readJSON<AdminUser | null>(KEYS.session, null));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const match = LOCAL_ADMINS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );
    if (!match) {
      throw new Error('Incorrect email or password.');
    }
    const session: AdminUser = { email: match.email };
    writeJSON(KEYS.session, session);
    setUser(session);
  };

  const logout = async () => {
    localStorage.removeItem(KEYS.session);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
