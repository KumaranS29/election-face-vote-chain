
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'voter' | 'candidate';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<{ success: boolean; requires2FA?: boolean }>;
  register: (email: string, password: string, name: string, role: 'voter' | 'candidate') => Promise<boolean>;
  logout: () => Promise<void>;
  send2FACode: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        
        if (session?.user) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile && !error) {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as 'admin' | 'voter' | 'candidate'
      });
    } else {
      // If the profile doesn't exist, check if it's admin and fallback
      if (session.user.email === 'kumaransenthilarasu@gmail.com') {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: 'Admin User',
          role: 'admin'
        });
      } else {
        console.error('User profile not found:', error);
        setUser(null);
      }
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    setUser(null);
  }
} else {
  setUser(null);
}

      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const send2FACode = async (email: string): Promise<boolean> => {
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code temporarily (in a real app, you'd store this securely)
      sessionStorage.setItem(`2fa_${email}`, code);
      
      // In a real implementation, you would send this via email
      console.log(`2FA Code for ${email}: ${code}`);
      alert(`2FA Code sent to ${email}: ${code}`);
      
      return true;
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      return false;
    }
  };

  const login = async (email: string, password: string, twoFactorCode?: string): Promise<{ success: boolean; requires2FA?: boolean }> => {
    try {
      console.log('Login attempt for:', email);
      
      // For admin account, allow direct login without 2FA
      if (email === 'kumaransenthilarasu@gmail.com' && password === 'SK29@2006') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Admin login error:', error);
          throw error;
        }
        console.log('Admin login successful');
        return { success: true };
      }

      // For voters and candidates, check if they need 2FA
      const storedCode = sessionStorage.getItem(`2fa_${email}`);
      
      if (!twoFactorCode && storedCode) {
        // 2FA code exists but not provided
        return { success: false, requires2FA: true };
      }
      
      if (!twoFactorCode) {
        // First time login, send 2FA code
        await send2FACode(email);
        return { success: false, requires2FA: true };
      }
      
      // Verify 2FA code
      if (storedCode && twoFactorCode === storedCode) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Clear the 2FA code after successful login
        sessionStorage.removeItem(`2fa_${email}`);
        return { success: true };
      } else {
        throw new Error('Invalid 2FA code');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const register = async (email: string, password: string, name: string, role: 'voter' | 'candidate'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!session,
    login,
    register,
    logout,
    send2FACode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
