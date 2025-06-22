import { create } from 'zustand';
import { User, AuthState } from '../types';
import { authService, SignUpData, SignInData } from '../services/api/authService';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),

  signIn: async (data: SignInData) => {
    set({ isLoading: true });
    try {
      const result = await authService.signIn(data);
      if (result.error) {
        set({ isLoading: false });
        return { success: false, error: result.error };
      }
      
      set({
        user: result.user,
        isAuthenticated: !!result.user,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },

  signUp: async (data: SignUpData) => {
    set({ isLoading: true });
    try {
      const result = await authService.signUp(data);
      if (result.error) {
        set({ isLoading: false });
        return { success: false, error: result.error };
      }
      
      set({
        user: result.user,
        isAuthenticated: !!result.user,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force logout even if API call fails
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const result = await authService.getCurrentUser();
      set({
        user: result.user,
        isAuthenticated: !!result.user,
        isLoading: false,
      });
      
      // Set up auth state listener
      authService.onAuthStateChange((user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    set({ isLoading: true });
    try {
      const result = await authService.updateProfile(updates);
      if (result.error) {
        set({ isLoading: false });
        return { success: false, error: result.error };
      }
      
      set({
        user: result.user,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
}));

// Initialize auth state when the store is created
useAuthStore.getState().initialize();