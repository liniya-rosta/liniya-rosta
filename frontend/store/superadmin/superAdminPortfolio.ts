import {GalleryItem, PaginationMeta, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {create} from "zustand/react";

interface PortfolioState {
    items: PortfolioItemPreview[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    selectedToDelete: string[],
    fetchPortfolioLoading: boolean;
    createLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
    paginationPortfolio: PaginationMeta | null;

    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    setPortfolioItemDetail: (data: PortfolioItemDetail) => void;
    setGalleryItem: (data: GalleryItem) => void;
    setSelectedToDelete: (data: string[]) => void;
    setPortfolioFetchLoading: (loading: boolean) => void;
    setPortfolioCreateLoading: (loading: boolean) => void;
    setPortfolioDeleteLoading: (loading: boolean) => void;
    setPortfolioEditLoading: (loading: boolean) => void;
    setPaginationPortfolio: (data: PaginationMeta) => void;
}

export const useSuperAdminPortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    detailItem: null,
    galleryItem: null,
    selectedToDelete: [],
    fetchPortfolioLoading: true,
    createLoading: false,
    editLoading: false,
    deleteLoading: false,
    paginationPortfolio: null,

    setPortfolioPreview: data => set({ items: data }),
    setPortfolioItemDetail: data => set({ detailItem: data }),
    setGalleryItem: data => set({ galleryItem: data }),
    setSelectedToDelete: data => set({ selectedToDelete: data }),
    setPortfolioFetchLoading: loading => set({ fetchPortfolioLoading: loading }),
    setPortfolioCreateLoading: loading => set({ createLoading: loading }),
    setPortfolioDeleteLoading: loading => set({ deleteLoading: loading }),
    setPortfolioEditLoading: loading => set({ editLoading: loading }),
    setPaginationPortfolio: data => set({ paginationPortfolio: data }),
}));