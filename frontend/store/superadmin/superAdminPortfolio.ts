import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {create} from "zustand/react";

interface PortfolioState {
    items: PortfolioItemPreview[];
    gallery: GalleryItem[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    fetchPortfolioLoading: boolean;
    createLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;

    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    setGallery: (data: GalleryItem[]) => void;
    setPortfolioItemDetail: (data: PortfolioItemDetail) => void;
    setGalleryItem: (data: GalleryItem) => void;
    setPortfolioFetchLoading: (loading: boolean) => void;
    setPortfolioCreateLoading: (loading: boolean) => void;
    setPortfolioDeleteLoading: (loading: boolean) => void;
    setPortfolioEditLoading: (loading: boolean) => void;
}

export const useSuperAdminPortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    gallery: [],
    detailItem: null,
    galleryItem: null,
    fetchPortfolioLoading: true,
    createLoading: false,
    editLoading: false,
    deleteLoading: false,

    setPortfolioPreview: data => set({ items: data }),
    setGallery:data => set({ gallery: data }),
    setPortfolioItemDetail: data => set({ detailItem: data }),
    setGalleryItem: data => set({ galleryItem: data }),
    setPortfolioFetchLoading: loading => set({fetchPortfolioLoading: loading}),
    setPortfolioCreateLoading: loading => set({createLoading: loading}),
    setPortfolioDeleteLoading: loading => set({deleteLoading: loading}),
    setPortfolioEditLoading: loading => set({editLoading: loading}),
}));