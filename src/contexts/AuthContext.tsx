import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Define response types for auth operations
export interface AuthResponse {
  error?: Error;
}

// Define the AuthContextType
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, name: string, password: string) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is logged in on mount and set up auth listener
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log('Auth state changed:', event, newSession?.user?.id);
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // Store user ID in localStorage when logged in or remove when logged out
            if (newSession?.user) {
              localStorage.setItem('userId', newSession.user.id);
              console.log('User ID stored in localStorage:', newSession.user.id);
            } else {
              localStorage.removeItem('userId');
              console.log('User ID removed from localStorage');
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [supabase.auth]);

  // Login function using Supabase
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });
      
      if (error) {
        console.error('Login error from Supabase:', error.message);
        return { error };
      }
      
      if (!data.user || !data.session) {
        console.error('Login succeeded but no user or session returned');
        return { error: new Error('Authentication failed. No user data returned.') };
      }
      
      console.log('Login successful, redirecting to dashboard');
      
      // Store user ID in localStorage
      if (data.user) {
        localStorage.setItem('userId', data.user.id);
        console.log('User ID stored in localStorage after login:', data.user.id);
      }
      
      router.push('/dashboard');
      return {};
    } catch (error: unknown) {
      console.error('Login exception:', error instanceof Error ? error.message : String(error));
      return { error: error instanceof Error ? error : new Error(String(error)) };
    } finally {
      setLoading(false);
    }
  };

  // Signup function using Supabase
  const signup = async (email: string, name: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      console.log('Attempting signup with email:', email, 'and name:', name);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      console.log('Signup response:', { user: data.user, session: !!data.session, error });
      
      if (error) {
        console.error('Signup error from Supabase:', error.message);
        return { error };
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Signup successful but email confirmation is required');
        return { 
          error: new Error('Please check your email to confirm your account before logging in.') 
        };
      }
      
      console.log('Signup successful, redirecting to dashboard');
      
      // Store user ID in localStorage
      if (data.user) {
        localStorage.setItem('userId', data.user.id);
        console.log('User ID stored in localStorage after signup:', data.user.id);
      }
      
      router.push('/dashboard');
      return {};
    } catch (error: unknown) {
      console.error('Signup exception:', error instanceof Error ? error.message : String(error));
      return { error: error instanceof Error ? error : new Error(String(error)) };
    } finally {
      setLoading(false);
    }
  };
  
  // Login with Google
  const loginWithGoogle = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        return { error };
      }
      
      return {};
    } catch (error: unknown) {
      console.error('Google login error:', error instanceof Error ? error.message : String(error));
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  // Logout function
  const logout = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signOut();
      // Clear user and session state
      setUser(null);
      setSession(null);
      localStorage.removeItem('userId');
      if (error) {
        return { error };
      }
      router.replace('/');
      return {};
    } catch (error: unknown) {
      console.error('Logout error:', error instanceof Error ? error.message : String(error));
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
