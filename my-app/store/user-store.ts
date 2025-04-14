import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/task';
import { users as initialUsers, currentUser as initialCurrentUser } from '../mocks/users';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  setCurrentUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      currentUser: initialCurrentUser,
      isLoading: false,
      error: null,

      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just use the mock data
          set({ users: initialUsers, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch users', isLoading: false });
        }
      },

      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },

      updateUserProfile: async (updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          if (!get().currentUser) {
            throw new Error('No current user');
          }
          
          const updatedUser = { ...get().currentUser, ...updates };
          
          // Update in users array
          const updatedUsers = get().users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          );
          
        //   set({ 
        //     currentUser: updatedUser,
        //     users: updatedUsers,
        //     isLoading: false 
        //   });
        } catch (error) {
          set({ error: 'Failed to update profile', isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        currentUser: state.currentUser
      }),
    }
  )
);