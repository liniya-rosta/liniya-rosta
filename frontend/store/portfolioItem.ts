import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {create} from "zustand/react";
import axiosAPI from "@/lib/axiosAPI";

interface PortfolioState {
    items: PortfolioItemPreview[];
    detailItem: PortfolioItemDetail | null;
    galleryItem: GalleryItem | null;
    fetchLoading: boolean;
    setPortfolioPreview: (data: PortfolioItemPreview[]) => void;
    fetchItem: (item_id: string) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    items: [],
    detailItem: null,
    galleryItem: null,
    fetchLoading: false,

    setPortfolioPreview: (data) => {
        set({ items: data })
    },

    // fetchPortfolio: async (gallery_id) => {
    //     set({fetchLoading: true});
    //
    //     try {
    //         if (gallery_id) {
    //             const response = await axiosAPI<GalleryItem>("/portfolio-items?galleryId=" + gallery_id);
    //             set({galleryItem: response.data});
    //         }
    //         set({items: response.data});
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         set({fetchLoading: false});
    //     }
    // },

    fetchItem: async (item_id) => {
        set({fetchLoading: true});

        try {
            const response = await axiosAPI("/portfolio-items/" + item_id);
            set({detailItem: response.data})
        } catch (e) {
            console.error(e)
        } finally {
            set({fetchLoading: false});
        }
    }
}));