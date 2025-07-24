import {GalleryItem, PaginationMeta, PortfolioItemDetail, PortfolioItemPreview} from "@/src/lib/types";
import {create} from "zustand/react";

interface PortfolioState {
    items: PortfolioItemPreview[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    fetchLoadingPortfolio: boolean;
    paginationPortfolio: PaginationMeta | null;

    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    setPortfolioItemDetail: (data: PortfolioItemDetail) => void;
    setGalleryItem: (data: GalleryItem) => void;
    setPortfolioLoading: (loading: boolean) => void;
    setPaginationPortfolio: (data: PaginationMeta) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    detailItem: null,
    galleryItem: null,
    fetchLoadingPortfolio: true,
    fetchErrorPortfolio: null,
    paginationPortfolio: null,
    setPortfolioPreview: (data) => set({ items: data }),
    setPortfolioItemDetail: (data) => set({ detailItem: data }),
    setGalleryItem: (data) => set({ galleryItem: data }),
    setPortfolioLoading: (loading) => set({ fetchLoadingPortfolio: loading }),
    setPaginationPortfolio: (data) => set({ paginationPortfolio: data }),
}));