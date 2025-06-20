import axiosAPI from "@/lib/axiosAPI";
import {GalleryItemValues, PortfolioEditValues, PortfolioMutation} from "@/lib/types";

export const createPortfolio = async (item: PortfolioMutation) => {
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

export const editPortfolioItem = async (
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

export const editGalleryItem = async ({item, gallery_id}: {
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

export const deletePortfolio = async (item_id: string) => {
    await axiosAPI.delete("superadmin/portfolio/" + item_id);
}

export const deleteGalleryItem = async (gallery_id: string) => {
    await axiosAPI.delete("superadmin/portfolio/gallery/" + gallery_id);
}