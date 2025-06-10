import axiosAPI from "@/lib/axiosAPI";
import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";

export const fetchAllPortfolio = async () => {
    const response = await axiosAPI<PortfolioItemPreview[]>("/portfolio-items");

    return response.data;
}

export const  fetchPortfolioItems = async ( item_id: string) => {
    const response = await axiosAPI<PortfolioItemDetail>("/portfolio-items/" + item_id);

    return response.data;
}

export const fetchGalleryItem = async ( gallery_id: string) => {
    const response = await axiosAPI<GalleryItem>("/portfolio-items?galleryId=" + gallery_id);

    return response.data;
}