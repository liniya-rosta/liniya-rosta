
import {GalleryItem, PortfolioItemDetail, PortfolioItemPreview, PortfolioMutation} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";

export const fetchPortfolioPreviews = async () => {
    const response = await axiosAPI<PortfolioItemPreview[]>("/portfolio-items");
    return response.data;
}

export const fetchPortfolioItems = async (item_id: string) => {
    const response = await axiosAPI<PortfolioItemDetail>("/portfolio-items/" + item_id);
    return response.data;
}

export const fetchGalleryItem = async (gallery_id: string) => {
    const response = await axiosAPI<GalleryItem>("/portfolio-items?galleryId=" + gallery_id);
    return response.data;
}

export const createPortfolioAdmin= async (item: PortfolioMutation) => {
    const formData = new FormData();
    formData.append("cover", item.cover);
    formData.append("description", item.description);
    formData.append("coverAlt", item.coverAlt);

    item.gallery.forEach((imgItem) => {
        if (imgItem.image instanceof File) {
            formData.append("gallery", imgItem.image);
            formData.append("alt", imgItem.alt);
        }
    });

    await axiosAPI.post("/superadmin/portfolio", formData);
}
