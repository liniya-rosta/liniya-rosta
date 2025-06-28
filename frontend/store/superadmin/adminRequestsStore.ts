import {IRequest} from "@/lib/types";
import {create} from "zustand/index";

interface RequestsState {
    requests: IRequest[];
    page: number;
    lastPage: number;
    totalItems: number;
    status: string | undefined;
    search: string;
    dateFrom: string;
    dateTo: string;
    fetchAllLoading: boolean;
    fetchAllError: string | null,
    updateLoading: boolean;
    deleteLoading: boolean;

    setRequests: (requests: IRequest[]) => void;
    setPage: (page: number) => void;
    setLastPage: (page: number) => void;
    setTotalItems:  (page: number) => void;
    setStatus: (value: string | undefined) => void
    setSearch: (search: string) => void;
    setDateFrom: (from: string) => void;
    setDateTo: (to: string) => void;
    setFetchAllLoading: (loading: boolean) => void;
    setFetchAllError: (error: string | null) => void;
    setUpdateLoading: (loading: boolean) => void;
    setDeleteLoading: (loading: boolean) => void;
}

export const useAdminRequestsStore = create<RequestsState>((set) => ({
    requests: [],
    page: 1,
    lastPage: 0,
    totalItems: 0,
    status: undefined,
    search: "",
    dateFrom: "",
    dateTo: "",
    fetchAllLoading: true,
    fetchAllError: null,
    updateLoading: false,
    deleteLoading: false,

    setPage: (page: number) => set({page}),
    setStatus: (status: string | undefined) => set({status}),
    setSearch: (search) => set({ search }),
    setDateFrom: (from) => set({ dateFrom: from }),
    setDateTo: (to) => set({ dateTo: to }),
    setTotalItems: (totalItems: number) => set({totalItems}),
    setLastPage: (page: number) => set({lastPage: page}),
    setRequests: (data) => set({ requests: data }),
    setFetchAllLoading: (loading) => set({fetchAllLoading: loading}),
    setFetchAllError: (error) => set({fetchAllError: error}),
    setUpdateLoading: (loading) => set({updateLoading: loading}),
    setDeleteLoading: loading => set({deleteLoading: loading}),
}));