import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        if (session?.user) {
          const isUserAdmin = await checkIfAdmin(session.user.id);
          setIsAdmin(isUserAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setError(null);
        setUser(session?.user || null);

        if (session?.user) {
          const isUserAdmin = await checkIfAdmin(session.user.id);
          setIsAdmin(isUserAdmin);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const checkIfAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
      if (error) throw error;
      return data || false;
    } catch (err) {
      console.error('Failed to check admin status:', err);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Sign in failed');
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Sign out failed');
      throw err;
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
