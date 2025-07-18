import {GalleryItem, PaginationMeta, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {create} from "zustand/react";

interface PortfolioState {
    items: PortfolioItemPreview[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    fetchLoadingPortfolio: boolean;
    paginationPortfolio: PaginationMeta | null;
    coverAlt: string;
    description: string;

    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    setPortfolioItemDetail: (data: PortfolioItemDetail) => void;
    setGalleryItem: (data: GalleryItem) => void;
    setPortfolioLoading: (loading: boolean) => void;
    setPaginationPortfolio: (data: PaginationMeta) => void;
    setCoverAlt: (coverAlt: string) => void;
    setDescription: (description: string) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    detailItem: null,
    galleryItem: null,
    fetchLoadingPortfolio: true,
    fetchErrorPortfolio: null,
    paginationPortfolio: null,
    description: '',
    coverAlt: '',
    setPortfolioPreview: (data) => set({ items: data }),
    setPortfolioItemDetail: (data) => set({ detailItem: data }),
    setGalleryItem: (data) => set({ galleryItem: data }),
    setPortfolioLoading: (loading) => set({ fetchLoadingPortfolio: loading }),
    setPaginationPortfolio: (data) => set({ paginationPortfolio: data }),
    setDescription: (description) => set({ description }),
    setCoverAlt: (coverAlt) => set({ coverAlt }),
}));