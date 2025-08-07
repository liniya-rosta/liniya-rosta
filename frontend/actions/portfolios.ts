import {GalleryItem, PortfolioItemDetail, PortfolioResponse} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const fetchPortfolioPreviews = async (
    limit?: string, page?: string, coverAlt?: string, description?: string) => {
    const searchParams = new URLSearchParams();

    if (page) searchParams.append("page", page);
    if (limit) searchParams.append("limit", limit);
    if (coverAlt) searchParams.append("coverAlt", coverAlt);
    if (description) searchParams.append("description", description);

    return await kyAPI
        .get("portfolio-items", {searchParams})
        .json<PortfolioResponse>();
}

export const fetchPortfolioItem = async (item_id: string) => {
    return await kyAPI
        .get(`portfolio-items/${item_id}`)
        .json<PortfolioItemDetail>();
}

export const fetchGalleryItem = async (gallery_id: string) => {
    return await kyAPI
        .get("portfolio-items", {searchParams: {galleryId: gallery_id}})
        .json<GalleryItem>();
}

export const fetchPortfolioItemBySlug = async (slug: string) => {
    return await kyAPI
        .get(`portfolio-items/slug/${slug}`)
        .json<PortfolioItemDetail>();
}