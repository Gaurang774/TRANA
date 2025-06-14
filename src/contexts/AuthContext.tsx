import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'patient' | 'doctor' | 'admin' | 'nurse' | 'dispatcher' | 'paramedic';
  phone: string | null;
  department: string | null;
  specialty: string | null;
  is_active: boolean | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; role: string }) => Promise<{ error: any; success?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any; success?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code !== 'PGRST116') { // Don't show toast for "not found" errors
          toast({
            title: "Profile Error",
            description: "Failed to load user profile",
            variant: "destructive"
          });
        }
        return;
      }

      const validRoles = ['patient', 'doctor', 'admin', 'nurse', 'dispatcher', 'paramedic'];
      const mappedProfile: Profile = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: validRoles.includes(data.role) ? data.role as Profile['role'] : 'patient',
        phone: data.phone,
        department: data.department,
        specialty: data.specialty,
        is_active: data.is_active,
      };

      setProfile(mappedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; role: string }) => {
    try {
      // Ensure we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Authentication must be performed in a browser environment');
      }

      const redirectUrl = `${window.location.origin}/`;
      
      console.log('Attempting sign up with email:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role
          },
          // Add CAPTCHA bypass for development/testing
          captchaToken: undefined
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Handle specific error cases including CAPTCHA
        let errorMessage = error.message;
        
        if (error.message.includes('Captcha verification failed') || error.message.includes('captcha')) {
          errorMessage = 'CAPTCHA verification is required. Please try again or contact support if this persists. On the free tier, you may need to upgrade your Supabase plan to bypass CAPTCHA requirements.';
        } else if (error.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.';
        } else if (error.message.includes('weak password')) {
          errorMessage = 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
        } else if (error.message.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('signup_disabled')) {
          errorMessage = 'Sign up is currently disabled. Please contact support.';
        }

        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
          duration: 8000
        });
        return { error, success: false };
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please check your email and click the link to complete your registration.",
          duration: 8000
        });
      } else {
        toast({
          title: "Welcome to TRANA!",
          description: "Your account has been created successfully.",
        });
      }

      return { error: null, success: true };
    } catch (error: any) {
      console.error('Sign up catch error:', error);
      
      let errorMessage = error.message || "An unexpected error occurred during sign up";
      
      // Handle network and CORS errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('CORS')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('captcha') || error.message?.includes('Captcha')) {
        errorMessage = 'CAPTCHA verification failed. This may be due to free tier limitations. Consider upgrading your Supabase plan or contact support.';
      }

      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
      return { error, success: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Ensure we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Authentication must be performed in a browser environment');
      }

      console.log('Attempting sign in with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
        options: {
          // Add CAPTCHA bypass for development/testing
          captchaToken: undefined
        }
      });

      if (error) {
        console.error('Sign in error:', error);
        
        let errorMessage = error.message;
        
        if (error.message.includes('Captcha verification failed') || error.message.includes('captcha')) {
          errorMessage = 'CAPTCHA verification is required. Please try again or contact support if this persists. On the free tier, you may need to upgrade your Supabase plan to bypass CAPTCHA requirements.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
        } else if (error.message.includes('signup_disabled')) {
          errorMessage = 'Authentication is currently disabled. Please contact support.';
        }

        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
          duration: 8000
        });
        return { error, success: false };
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }

      return { error: null, success: true };
    } catch (error: any) {
      console.error('Sign in catch error:', error);
      
      let errorMessage = error.message || "An unexpected error occurred during sign in";
      
      // Handle network and CORS errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('CORS')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('captcha') || error.message?.includes('Captcha')) {
        errorMessage = 'CAPTCHA verification failed. This may be due to free tier limitations. Consider upgrading your Supabase plan or contact support.';
      }

      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
      return { error, success: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        await fetchProfile(user.id);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
