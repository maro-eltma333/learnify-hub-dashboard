
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { toast } from 'sonner';

// Mock data for now - will be replaced with Supabase integration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Student User',
    email: 'student@example.com',
    password: 'password123',
    role: 'student' as const,
    profileImage: 'https://ui-avatars.com/api/?name=Student+User&background=6366f1&color=fff'
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher' as const,
    profileImage: 'https://ui-avatars.com/api/?name=Teacher+User&background=8b5cf6&color=fff'
  },
  {
    id: '3',
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager' as const,
    profileImage: 'https://ui-avatars.com/api/?name=Manager+User&background=ec4899&color=fff'
  }
];

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<boolean>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  socialSignIn: (provider: 'google' | 'facebook') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('learnify_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('learnify_user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication logic - replace with actual auth
      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        toast.error('Invalid email or password');
        return false;
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = user;
      
      localStorage.setItem('learnify_user', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast.success('Successfully signed in');
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      return false;
    }
  };

  const signUp = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'student' | 'teacher'
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (exists) {
        toast.error('Email already in use');
        return false;
      }
      
      // In a real app, this would create a new user in the database
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        role,
        profileImage: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=6366f1&color=fff`
      };
      
      localStorage.setItem('learnify_user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem('learnify_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast.success('Signed out successfully');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Mock password reset - in real app would send email
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        toast.error('No account found with this email');
        return false;
      }
      
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset instructions');
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      const updatedUser = { ...authState.user, ...data };
      localStorage.setItem('learnify_user', JSON.stringify(updatedUser));
      
      setAuthState({
        ...authState,
        user: updatedUser
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const socialSignIn = async (provider: 'google' | 'facebook'): Promise<boolean> => {
    try {
      // Mock social sign in - would integrate with OAuth providers
      toast.success(`Mock ${provider} sign in successful`);
      
      // Just use the student user for demonstration
      const user = MOCK_USERS[0];
      const { password: _, ...userWithoutPassword } = user;
      
      localStorage.setItem('learnify_user', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast.error(`Failed to sign in with ${provider}`);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        socialSignIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
