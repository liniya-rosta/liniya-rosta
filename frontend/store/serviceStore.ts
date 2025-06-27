import {Service} from "@/lib/types";
import {create} from "zustand/react";

interface ServiceState {
    allServices: Service[];
    fetchLoadingService: boolean;

    setAllServices: (data: Service[]) => void;
    setFetchLoading: (loading: boolean) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
    allServices: [],
    fetchLoadingService: true,
    setAllServices: (data) => set({ allServices: data }),
    setFetchLoading: (loading) => set({ fetchLoadingService: loading }),
}));