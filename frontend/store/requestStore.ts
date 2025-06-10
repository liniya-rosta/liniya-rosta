import {create} from "zustand/react";


interface RequestState {
    createLoading: boolean;
    createError: boolean;
    errorMessage: null | string;
    setLoading: (state: boolean) => void;
    setError: (message: null | string) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
    createLoading: false,
    createError: false,
    errorMessage: null,

    setLoading: (value) => set({createLoading: value}),
    setError: (message) => set({
        createError: !!message,
        errorMessage: message,
    }),
}));