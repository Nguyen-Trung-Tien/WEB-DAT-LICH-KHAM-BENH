import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleTheme: () => {
        const nextMode = !get().isDarkMode;
        set({ isDarkMode: nextMode });
        if (nextMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      },
      applyTheme: () => {
        const isDark = get().isDarkMode;
        if (isDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    }),
    {
      name: 'bookingcare-theme-storage',
    }
  )
);

export default useThemeStore;
