import { User} from "@/lib/types";
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface UserState {
    user: User | null,
    setUser: (user: User | null) => void;
    setLogout: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            setLogout: () => set({ user: null }),
        }),
        {
            name: "user",
        }
    )
);

export default useUserStore;