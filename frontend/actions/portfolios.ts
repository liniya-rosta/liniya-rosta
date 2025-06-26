import {GalleryItem, PaginatedPortfolioResponse, PortfolioItemDetail} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";

export const fetchPortfolioPreviews = async ( limit?: string, page?: string) => {
    const params = new URLSearchParams();

    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const response = await axiosAPI<PaginatedPortfolioResponse>(
        `/portfolio-items${params.toString() ? `?${params.toString()}` : ""}`
    );

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