import {IRequest} from "@/lib/types";
import {create} from "zustand/index";

interface RequestsState {
    requests: IRequest[];
    fetchAllLoading: boolean;
    updateLoading: boolean;
    fetchAllError: string | null;
    updateError: string | null;
    setRequests: (requests: IRequest[]) => void;
    setFetchAllLoading: (loading: boolean) => void;
    setUpdateLoading: (loading: boolean) => void;
    setFetchAllError: (error: string | null) => void;
    setUpdateError: (error: string | null) => void;
}

export const useAdminRequestsStore = create<RequestsState>((set) => ({
    requests: [],
    fetchAllLoading: true,
    updateLoading: false,
    fetchAllError: null,
    updateError: null,
    setRequests: (data) => set({ requests: data }),
    setFetchAllLoading: (loading) => set({fetchAllLoading: loading}),
    setUpdateLoading: (loading) => set({updateLoading: loading}),
    setFetchAllError: (error) => set({fetchAllError: error}),
    setUpdateError: (error) => set({updateError: error}),
}));