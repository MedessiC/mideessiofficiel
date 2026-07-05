import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { normalizeEmail, sanitizeUsername, validatePassword } from '../utils/authProfile';
import { getProviderAvatarUrl } from '../utils/providerProfile';

export type UserRole = 'user' | 'admin' | 'client';

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  currentUserProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithProvider: (provider: 'google' | 'github' | 'facebook') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  detectRole: (userId: string) => Promise<UserRole>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

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
        .eq('auth_user_id', userId)
        .maybeSingle();

      if (clientData) return 'client';

      // Default to regular user
      return 'user';
    } catch (error) {
      console.error('Error detecting user role:', error);
      return 'user';
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('id, username, avatar_url, bio')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data) {
        setCurrentUserProfile({
          id: data.id,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const refreshUserProfile = async () => {
    if (user) await loadUserProfile(user);
  };

  const ensureUserProfile = async (authUser: User | null) => {
    if (!authUser) return;

    try {
      const avatarUrl = getProviderAvatarUrl(authUser.user_metadata as Record<string, unknown> | undefined);
      const metadataUsername = (authUser.user_metadata?.username as string | undefined)?.trim();
      const emailPrefix = authUser.email?.split('@')[0]?.toLowerCase();
      const baseUsername = sanitizeUsername(metadataUsername || emailPrefix || `user${authUser.id.slice(0, 8)}`);

      const { data: existingProfile } = await supabase
        .from('users')
        .select('id, avatar_url')
        .eq('id', authUser.id)
        .maybeSingle();

      if (existingProfile) {
        // Update avatar from provider if missing or changed
        if (avatarUrl && (!existingProfile.avatar_url || existingProfile.avatar_url !== avatarUrl)) {
          await supabase
            .from('users')
            .update({ avatar_url: avatarUrl })
            .eq('id', authUser.id);
        }
        // Always refresh local profile after ensuring
        await loadUserProfile(authUser);
        return;
      }

      const { error } = await supabase.rpc('ensure_user_profile', {
        p_user_id: authUser.id,
        p_email: authUser.email || '',
        p_username: baseUsername,
      });

      if (!error) {
        await supabase
          .from('users')
          .update({ avatar_url: avatarUrl || null })
          .eq('id', authUser.id);
      } else if (!error.message.toLowerCase().includes('permission') && !error.message.toLowerCase().includes('policy')) {
        console.error('Error creating user profile:', error);
      }

      await loadUserProfile(authUser);
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let session = null;

        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) {
            console.warn('Supabase OAuth redirect error:', error);
          }
          session = data?.session ?? null;

          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }

        if (!session) {
          const { data } = await supabase.auth.getSession();
          session = data.session;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const role = await detectRole(session.user.id);
          setUserRole(role);
          void ensureUserProfile(session.user);
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
          const role = await detectRole(session.user.id);
          setUserRole(role);
          void ensureUserProfile(session.user);
        } else {
          setUserRole(null);
          setCurrentUserProfile(null);
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
      const normalizedEmail = normalizeEmail(email);
      const safeUsername = sanitizeUsername(username);
      const passwordValidation = validatePassword(password);

      if (!normalizedEmail || !password || !safeUsername) {
        return { error: 'Tous les champs sont requis' };
      }

      if (!passwordValidation.valid) {
        return { error: passwordValidation.message };
      }

      if (safeUsername.length < 3) {
        return { error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            username: safeUsername,
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

  const signInWithProvider = async (
    provider: 'google' | 'github' | 'facebook'
  ): Promise<{ error: string | null }> => {
    try {
      const redirectTo = import.meta.env.VITE_SUPABASE_OAUTH_REDIRECT_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (error) {
        return { error: error.message };
      }

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
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail || !password) {
        return { error: 'Email et mot de passe requis' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
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
        currentUserProfile,
        refreshUserProfile,
        signUp,
        signIn,
        signInWithProvider,
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
