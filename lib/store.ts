import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminState {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            login: (token) => set({ token, isAuthenticated: true }),
            logout: () => set({ token: null, isAuthenticated: false }),
        }),
        {
            name: 'admin-storage',
            storage: createJSONStorage(() => sessionStorage), // Use session storage for security (clears on close)
            // or localStorage if persistence is preferred.
        }
    )
);
