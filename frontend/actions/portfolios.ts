import {
    GalleryItem,
    GalleryItemValues,
    PortfolioEditValues,
    PortfolioItemDetail,
    PortfolioItemPreview,
    PortfolioMutation
} from "@/lib/types";
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

export const createPortfolioSuperAdmin = async (item: PortfolioMutation) => {
    const formData = new FormData();

    if (item.cover) {
        formData.append("cover", item.cover);
    }

    formData.append("description", item.description);
    formData.append("coverAlt", item.coverAlt);

    item.gallery.forEach((galleryItem) => {
        if (galleryItem.image instanceof File) {
            formData.append("gallery", galleryItem.image);
            formData.append("alt", galleryItem.alt);
        }
    });

    await axiosAPI.post("/superadmin/portfolio", formData);
}

export const editPortfolioItemSuperAdmin = async (
    {item, id} : {item: PortfolioEditValues, id: string}
) => {
    const formData = new FormData();

    if (item.cover) {
        formData.append("cover", item.cover);
    }

    if (item.description) {
        formData.append("description", item.description);
    }

    if (item.coverAlt) {
        formData.append("coverAlt", item.coverAlt);
    }

    await axiosAPI.patch("/superadmin/portfolio/" + id, formData);
}

export const editGalleryItemSuperAdmin = async ({item, gallery_id}: {
    item: GalleryItemValues,
    gallery_id: string,
}) => {
    const formData = new FormData();

    if (item.image) {
        formData.append("gallery", item.image);
    }

    if (item.alt) {
        formData.append("gallery", item.alt);
    }

    await axiosAPI.patch("superadmin/portfolio/gallery/" + gallery_id, formData);
}

export const deletePortfolioSuperAdmin = async (item_id: string) => {
    await axiosAPI.delete("superadmin/portfolio/" + item_id);
}

export const deleteGalleryItemSuperAdmin = async (gallery_id: string) => {
    await axiosAPI.delete("superadmin/portfolio/gallery/" + gallery_id);
}