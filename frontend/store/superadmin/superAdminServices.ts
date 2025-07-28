import {ServiceResponse} from "@/src/lib/types";
import {create} from "zustand/react";

interface AdminServicesState {
    services: ServiceResponse | null;
    fetchServiceLoading:  boolean;
    createServiceLoading: boolean;
    deleteServiceLoading: boolean;
    updateServiceLoading: boolean;

    setServices: (data: ServiceResponse) => void;
    setFetchServiceLoading: (loading: boolean) => void;
    setCreateServiceLoading: (loading: boolean) => void;
    setUpdateServiceLoading: (loading: boolean) => void;
    setDeleteServiceLoading: (loading: boolean) => void;
}

export const useSuperAdminServicesStore = create<AdminServicesState>((set) => ({
    services: null,
    fetchServiceLoading: true,
    createServiceLoading: false,
    deleteServiceLoading: false,
    updateServiceLoading: false,

    setServices: (data) => set({services: data}),
    setCreateServiceLoading: (loading) => set({createServiceLoading: loading}),
    setFetchServiceLoading: (loading) => set({fetchServiceLoading: loading}),
    setUpdateServiceLoading: (loading) => set({updateServiceLoading: loading}),
    setDeleteServiceLoading: (loading) => set({deleteServiceLoading: loading}),
}));