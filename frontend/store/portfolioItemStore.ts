import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {create} from "zustand/react";

interface PortfolioState {
    items: PortfolioItemPreview[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    fetchLoadingPortfolio: boolean;

    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    setPortfolioItemDetail: (data: PortfolioItemDetail) => void;
    setGalleryItem: (data: GalleryItem) => void;
    setPortfolioLoading: (loading: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    detailItem: null,
    galleryItem: null,
    fetchLoadingPortfolio: true,
    fetchErrorPortfolio: null,
    setPortfolioPreview: (data) => set({ items: data }),
    setPortfolioItemDetail: (data) => set({ detailItem: data }),
    setGalleryItem: (data) => set({ galleryItem: data }),
    setPortfolioLoading: (loading) => set({fetchLoadingPortfolio: loading}),
}));