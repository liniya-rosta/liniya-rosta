import {create} from "zustand";

interface AuthState {
    accessToken: string | null,
    setAccessToken: (token: string | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    setAccessToken: (accessToken) => set({ accessToken }),
}));

export default useAuthStore;