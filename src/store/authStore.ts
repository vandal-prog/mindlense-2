import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<'confirmed' | 'confirmation_sent'>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

let authListenerRegistered = false;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function ensureUserProfile(user: User) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingUser) {
      const { error } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name ?? user.email,
          onboarding_completed: false,
        },
        { onConflict: 'id' }
      );

      if (error) {
        console.error('Error creating user record:', error);
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error('Please confirm your email first. Check your inbox for the confirmation link.');
      }
      throw error;
    }
  },
  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      if (error.message.includes('already registered') || error.message.includes('duplicate')) {
        throw new Error('This email is already registered. Try signing in instead.');
      }
      throw error;
    }

    if (data.session) {
      return 'confirmed';
    }

    return 'confirmation_sent';
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  initialize: async () => {
    try {
      if (!authListenerRegistered) {
        authListenerRegistered = true;
        supabase.auth.onAuthStateChange((_event, session) => {
          const user = session?.user ?? null;
          set({ user });
          if (user) {
            void ensureUserProfile(user);
          }
        });
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        try {
          await withTimeout(
            supabase.auth.exchangeCodeForSession(code),
            8000,
            'Email confirmation'
          );
        } catch (error) {
          console.error('Email confirmation error:', error);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const { data: { session } } = await withTimeout(
        supabase.auth.getSession(),
        8000,
        'Session check'
      );

      const user = session?.user ?? null;
      set({ user });

      if (user) {
        void ensureUserProfile(user);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
