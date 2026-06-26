import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin' | 'client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  detectRole: (userId: string) => Promise<UserRole>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Detect user role (admin, client, or regular user)
  const detectRole = async (userId: string): Promise<UserRole> => {
    try {
      // Check if admin
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (adminData) return 'admin';

      // Check if client
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (clientData) return 'client';

      // Default to regular user
      return 'user';
    } catch (error) {
      console.error('Error detecting user role:', error);
      return 'user';
    }
  };

  const ensureUserProfile = async (authUser: User | null) => {
    if (!authUser) return;

    try {
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (existingProfile) return;

      const metadataUsername = (authUser.user_metadata?.username as string | undefined)?.trim();
      const emailPrefix = authUser.email?.split('@')[0]?.toLowerCase();
      const baseUsername = (metadataUsername || emailPrefix || `user${authUser.id.slice(0, 8)}`)
        .replace(/[^a-zA-Z0-9._-]/g, '')
        .toLowerCase()
        .slice(0, 24) || `user${authUser.id.slice(0, 8)}`;

      const { error } = await supabase.from('users').insert({
        id: authUser.id,
        email: authUser.email || '',
        username: baseUsername,
      });

      if (error && !error.message.toLowerCase().includes('permission')) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await ensureUserProfile(session.user);
          const role = await detectRole(session.user.id);
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth session:', error);
        setSession(null);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await ensureUserProfile(session.user);
          const role = await detectRole(session.user.id);
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ error: string | null }> => {
    try {
      // Valider les entrées
      if (!email || !password || !username) {
        return { error: 'Tous les champs sont requis' };
      }

      if (password.length < 6) {
        return { error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

      if (username.length < 3) {
        return { error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
      }

      // S'inscrire avec Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          return { error: 'Cet email est déjà enregistré' };
        }
        return { error: error.message };
      }

      // Le trigger crée automatiquement le user en base
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Une erreur est survenue' };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      if (!email || !password) {
        return { error: 'Email et mot de passe requis' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou mot de passe incorrect' };
        }
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Une erreur est survenue' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        signUp,
        signIn,
        signOut,
        detectRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
