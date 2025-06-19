import { User} from "@/lib/types";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface UserState {
    user: User | null,
    accessToken: string | null,
    setUser: (user: User | null) => void;
    setLogout: () => void;
    setAccessToken: (token: string | null) => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setUser: (user) => set({ user }),
            setLogout: () => set({ user: null, accessToken: null }),
            setAccessToken: (accessToken) => set({ accessToken }),
        }),
        {
            name: "user",
        }
    )
);

export default useUserStore;