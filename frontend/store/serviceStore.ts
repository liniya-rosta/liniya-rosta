import {Service} from "@/src/lib/types";
import {create} from "zustand/react";

interface ServiceState {
    allServices: Service[];
    fetchLoadingService: boolean;

    setAllServices: (data: Service[]) => void;
    setFetchServiceLoading: (loading: boolean) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
    allServices: [],
    fetchLoadingService: true,
    setAllServices: (data) => set({ allServices: data }),
    setFetchServiceLoading: (loading) => set({ fetchLoadingService: loading }),
}));