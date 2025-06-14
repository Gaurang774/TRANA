
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Mock auth hook for public access mode
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // No loading needed in public mode

  useEffect(() => {
    // In public mode, we don't have authenticated users
    setUser(null);
    setSession(null);
    setLoading(false);
  }, []);

  const signOut = async () => {
    // No-op in public mode
    return;
  };

  return {
    user,
    session,
    loading,
    signOut
  };
};
