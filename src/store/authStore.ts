import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email, password, name) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    if (!user) throw new Error('Signup failed');

    // Wait for the auth session to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create the user record in our database
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name,
        created_at: new Date().toISOString(),
        onboarding_completed: false
      });

    if (insertError) {
      // If insert fails, try upsert as a fallback
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name,
          created_at: new Date().toISOString(),
          onboarding_completed: false
        }, {
          onConflict: 'id'
        });
      
      if (upsertError) throw upsertError;
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  initialize: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if user exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, onboarding_completed')
        .eq('id', user.id)
        .single();

      // If user doesn't exist in our database, create it
      if (!existingUser) {
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            onboarding_completed: false
          }, {
            onConflict: 'id'
          });
        
        if (upsertError) {
          console.error('Error creating user record:', upsertError);
        }
      }
    }

    set({ user, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },
}));