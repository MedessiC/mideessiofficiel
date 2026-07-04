import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { hashPassword } from '../utils/encryptionUtils';

interface ClientUser {
  id: string;
  client_id: string;
  email: string;
  nom_marque: string;
  pack: string;
  is_first_login: boolean;
}

interface ClientContextType {
  user: ClientUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  completeOnboarding: () => Promise<void>;
}

const CLIENT_SESSION_KEY = 'client_session';

const safeReadClientSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CLIENT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && parsed.client_id ? parsed : null;
  } catch {
    window.localStorage.removeItem(CLIENT_SESSION_KEY);
    return null;
  }
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const parsedUser = safeReadClientSession();
        if (parsedUser) {
          if (!parsedUser?.client_id) {
            localStorage.removeItem(CLIENT_SESSION_KEY);
            return;
          }

          // Verify user still exists in database
          const { data, error: fetchError } = await supabase
            .from('clients')
            .select('id, client_id, email, nom_marque, pack')
            .eq('client_id', parsedUser.client_id)
            .single();

          if (data && !fetchError) {
            setUser({
              ...data,
              is_first_login: false
            });
          } else {
            localStorage.removeItem(CLIENT_SESSION_KEY);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        localStorage.removeItem(CLIENT_SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // Hash the password client-side
      const passwordHash = await hashPassword(password);

      // Fetch client from database
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('id, client_id, email, nom_marque, pack, password_hash, statut')
        .eq('email', email)
        .single();

      if (fetchError || !data) {
        setError('Email ou mot de passe incorrect');
        throw new Error('Client not found');
      }

      // Check if client is active
      if (data.statut !== 'actif') {
        setError('Votre compte est suspendu ou inactif');
        throw new Error('Client account not active');
      }

      // Compare password hashes
      if (data.password_hash !== passwordHash) {
        setError('Email ou mot de passe incorrect');
        throw new Error('Invalid password');
      }

      // Create user object
      const clientUser: ClientUser = {
        id: data.id,
        client_id: data.client_id,
        email: data.email,
        nom_marque: data.nom_marque,
        pack: data.pack,
        is_first_login: true // User just logged in
      };

      // Store only minimal client identity in localStorage
      localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify({
        client_id: clientUser.client_id,
        email: clientUser.email,
        nom_marque: clientUser.nom_marque,
        pack: clientUser.pack,
        is_first_login: clientUser.is_first_login,
      }));
      setUser(clientUser);
    } catch (err: any) {
      if (!error) {
        setError(err.message || 'Une erreur est survenue lors de la connexion');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(CLIENT_SESSION_KEY);
    setUser(null);
    setError(null);
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // Update user state to mark first login as complete
      const updatedUser = { ...user, is_first_login: false };
      localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify({
        client_id: updatedUser.client_id,
        email: updatedUser.email,
        nom_marque: updatedUser.nom_marque,
        pack: updatedUser.pack,
        is_first_login: updatedUser.is_first_login,
      }));
      setUser(updatedUser);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      throw err;
    }
  };

  return (
    <ClientContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signOut,
        completeOnboarding
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientAuth = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientAuth must be used within ClientProvider');
  }
  return context;
};
