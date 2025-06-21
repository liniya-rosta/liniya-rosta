import { User } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    user: User | null;
    accessToken: string | null;
    hasHydrated: boolean;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    setLogout: () => void;
    setHasHydrated: (v: boolean) => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            hasHydrated: false,
            setUser: (user) => set({ user }),
            setAccessToken: (token) => set({ accessToken: token }),
            setLogout: () => set({ user: null, accessToken: null }),
            setHasHydrated: (v) => set({ hasHydrated: v }),
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