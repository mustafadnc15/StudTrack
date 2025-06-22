import { supabase } from './supabaseClient';
import { User } from '../../types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'coach';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp({ email, password, name, role }: SignUpData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Failed to create user account' };
      }

      // Wait for the trigger to create the user profile
      let attempts = 0;
      let userProfile = null;
      
      while (attempts < 10 && !userProfile) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          userProfile = profile;
          break;
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!userProfile) {
        return { user: null, error: 'Failed to create user profile' };
      }

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          avatar_url: userProfile.avatar_url,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Failed to sign in' };
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !userProfile) {
        return { user: null, error: 'Failed to load user profile' };
      }

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          avatar_url: userProfile.avatar_url,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get the current session and user
   */
  async getCurrentUser(): Promise<AuthResult> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        return { user: null, error: error.message };
      }

      if (!session?.user) {
        return { user: null, error: null };
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !userProfile) {
        return { user: null, error: 'Failed to load user profile' };
      }

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          avatar_url: userProfile.avatar_url,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<AuthResult> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        return { user: null, error: 'User not authenticated' };
      }

      const { data: updatedProfile, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single();

      if (error) {
        return { user: null, error: error.message };
      }

      return {
        user: {
          id: updatedProfile.id,
          email: updatedProfile.email,
          name: updatedProfile.name,
          role: updatedProfile.role,
          avatar_url: updatedProfile.avatar_url,
          created_at: updatedProfile.created_at,
          updated_at: updatedProfile.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { user } = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: error?.message || null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}

export const authService = new AuthService();