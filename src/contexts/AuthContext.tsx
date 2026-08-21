import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getStoredRedirectTarget, clearStoredRedirectTarget, peekStoredRedirectTarget } from '../utils/authRedirect';
import { User, Session } from '@supabase/supabase-js';
import { normalizeEmail, sanitizeUsername, validatePassword } from '../utils/authProfile';

// ── Types ────────────────────────────────────────────────────

export type AppRole = 'admin' | 'cofondateur' | 'membre';

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  avatar_url: string | null;
  role: AppRole;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: UserProfile | null;
  isAdmin: boolean;
  isCofondateur: boolean;
  refreshProfile: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    fullName?: string,
    nationality?: string,
    phone?: string
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithProvider: (provider: 'google') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // ── Chargement du profil depuis la table profiles ──────────
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, email, phone, nationality, avatar_url, role, is_active, is_banned, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Erreur chargement profil:', error.message);
        return;
      }

      setProfile(data as UserProfile | null);
    } catch (err) {
      console.error('[Auth] Exception chargement profil:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  // ── Gestion de l'état d'authentification ──────────────────
  const handleSession = async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (!session?.user) {
      setProfile(null);
      return;
    }

    // Redirection post-OAuth si une cible avait été mémorisée
    try {
      const target = peekStoredRedirectTarget();
      if (target && typeof window !== 'undefined' && window.location.pathname !== target) {
        clearStoredRedirectTarget();
        window.location.replace(target);
        return;
      }
    } catch (_) { /* ignore */ }

    await loadProfile(session.user.id);
  };

  // ── Initialisation au montage ─────────────────────────────
  useEffect(() => {
    let isInitializing = true;

    // Safety net: never block the UI more than 1.5 seconds
    const safetyTimer = setTimeout(() => {
      if (isInitializing) {
        isInitializing = false;
        setLoading(false);
      }
    }, 1500);

    const init = async () => {
      try {
        // Gère le retour OAuth (hash #access_token)
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (!error && data?.session) {
            await handleSession(data.session);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            // ⚠️ Ne pas faire return ici — on doit toujours atteindre le finally
          }
        } else {
          const { data } = await supabase.auth.getSession();
          await handleSession(data.session);
        }
      } catch (err) {
        console.error('[Auth] Erreur initialisation:', err);
        setUser(null);
        setSession(null);
        setProfile(null);
      } finally {
        clearTimeout(safetyTimer);
        isInitializing = false;
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        await handleSession(session);
      } catch (err) {
        console.error('[Auth] Erreur onAuthStateChange:', err);
      } finally {
        if (!isInitializing) {
          setLoading(false);
        }
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, []);

  // ── Inscription ───────────────────────────────────────────
  const signUp = async (
    email: string,
    password: string,
    username: string,
    fullName?: string,
    nationality?: string,
    phone?: string
  ): Promise<{ error: string | null }> => {
    const normalizedEmail = normalizeEmail(email);
    const safeUsername = sanitizeUsername(username);
    const passwordValidation = validatePassword(password);

    if (!normalizedEmail || !password || !safeUsername) {
      return { error: 'Tous les champs sont requis' };
    }
    if (!passwordValidation.valid) {
      return { error: passwordValidation.message || 'Mot de passe invalide' };
    }
    if (safeUsername.length < 3) {
      return { error: "Le nom d'utilisateur doit contenir au moins 3 caractères" };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            username: safeUsername,
            full_name: fullName || null,
            nationality: nationality || null,
            phone: phone || null,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          return { error: 'Cet email est déjà enregistré' };
        }
        return { error: error.message };
      }

      // Le trigger handle_new_user() crée automatiquement le profil en base
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Une erreur est survenue' };
    }
  };

  // ── Connexion ─────────────────────────────────────────────
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return { error: 'Email et mot de passe requis' };
    }

    try {
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

  // ── Connexion OAuth (Google) ──────────────────────────────
  const signInWithProvider = async (
    provider: 'google'
  ): Promise<{ error: string | null }> => {
    try {
      const redirectTo = import.meta.env.VITE_SUPABASE_OAUTH_REDIRECT_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Une erreur est survenue' };
    }
  };

  // ── Déconnexion ───────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  // ── Valeurs dérivées ──────────────────────────────────────
  const isAdmin = profile?.role === 'admin' && profile.is_active && !profile.is_banned;
  const isCofondateur = (profile?.role === 'cofondateur' || profile?.role === 'admin') && profile.is_active && !profile.is_banned;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profile,
        isAdmin,
        isCofondateur,
        refreshProfile,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
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
