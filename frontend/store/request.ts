import {IRequestMutation} from "@/lib/types";
import {create} from "zustand/react";
import axiosAPI from "@/lib/axiosAPI";

interface RequestState {
    createItem: (request: IRequestMutation) => Promise<string | null>;
    createLoading: boolean;
    createError: boolean;
    errorMessage: null | string;
}

export const useRequestStore = create<RequestState>((set) => ({
    createLoading: true,
    createError: false,
    errorMessage: null,

    createItem: async (request) => {
        set({createLoading: true});

        try {
            await axiosAPI.post('/requests', request);
            return null
        } catch (e: any) {
            const messageError = e.response?.data?.message;

            set({
                createError: true,
                errorMessage: messageError,
            });

            return messageError
        } finally {
            set({createLoading: false});
        }
    },
}));