import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";

export const fetchPortfolioPreviews = async () => {
    const response = await axiosAPI<PortfolioItemPreview[]>("/portfolio-items");
    return response.data;
}

export const fetchPortfolioItem = async (item_id: string) => {
    const response = await axiosAPI<PortfolioItemDetail>("/portfolio-items/" + item_id);
    return response.data;
}

export const fetchGalleryItem = async (gallery_id: string) => {
    const response = await axiosAPI<GalleryItem>("/portfolio-items?galleryId=" + gallery_id);
    return response.data;
}