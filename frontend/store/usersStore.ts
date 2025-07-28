import { User } from "@/src/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    user: User | null;
    accessToken: string | null;
    hasHydrated: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    setLogout: () => void;
    setHasHydrated: (v: boolean) => void;
    setLoading: (loading: boolean) => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            hasHydrated: false,
            loading: false,
            setUser: (user) => set({ user }),
            setAccessToken: (token) => set({ accessToken: token }),
            setLogout: () => set({ user: null, accessToken: null }),
            setHasHydrated: (v) => set({ hasHydrated: v }),
            setLoading: (loading) => set({ loading }),
        }),
        {
            name: "user",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export default useUserStore;