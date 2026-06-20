import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api.js';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      userInfo: null,
      error: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/api/login', { email, password });
          const data = response.data;
          
          if (data && data.errCode === 0) {
            set({
              isLoggedIn: true,
              userInfo: data.user,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            set({
              isLoggedIn: false,
              userInfo: null,
              isLoading: false,
              error: data.message || 'Login failed!',
            });
            return { success: false, message: data.message || 'Login failed!' };
          }
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Network error, please try again.';
          set({
            isLoggedIn: false,
            userInfo: null,
            isLoading: false,
            error: errMsg,
          });
          return { success: false, message: errMsg };
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          userInfo: null,
          error: null,
        });
      },
    }),
    {
      name: 'bookingcare-auth-storage', // Key name in localStorage
    }
  )
);

export default useAuthStore;
