import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {create} from "zustand/react";

interface PortfolioState {
    items: PortfolioItemPreview[];
    gallery: GalleryItem[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    fetchLoading: boolean;
    createLoading: boolean;
    updateLoading: boolean;

    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    setGallery: (data: GalleryItem[]) => void;
    setPortfolioItemDetail: (data: PortfolioItemDetail) => void;
    setGalleryItem: (data: GalleryItem) => void;
}

export const useSuperAdminPortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    gallery: [],
    detailItem: null,
    galleryItem: null,
    fetchLoading: false,
    createLoading: false,
    updateLoading: false,
    setPortfolioPreview: (data) => set({ items: data }),
    setGallery: (data) => set({ gallery: data }),
    setPortfolioItemDetail: (data) => set({ detailItem: data }),
    setGalleryItem: (data) => set({ galleryItem: data }),
}));