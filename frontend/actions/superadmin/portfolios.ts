import axiosAPI from "@/src/lib/axiosAPI";
import {GalleryEditValues, PortfolioEditValues, PortfolioMutation} from "@/src/lib/types";

export const createPortfolio = async (item: PortfolioMutation) => {
    const formData = new FormData();

    if (item.cover) {
        formData.append("cover", item.cover);
    }

    formData.append("description", item.description.ru);
    formData.append("coverAlt", item.coverAlt.ru);

    if (item.seoTitle) {
        formData.append("seoTitle", item.seoTitle);
    }

    if (item.seoDescription) {
        formData.append("seoDescription", item.seoDescription);
    }

    item.gallery.forEach((galleryItem) => {
        if (galleryItem.image instanceof File) {
            formData.append("gallery", galleryItem.image);
            formData.append("alt", galleryItem.alt?.ru || "Элемент галереи");
        }
    });

    await axiosAPI.post("/superadmin/portfolio", formData);
}

export const editPortfolioItem = async (
    {item, id}: { item: PortfolioEditValues, id: string }
) => {
    const formData = new FormData();

    if (item.cover) {
        formData.append("cover", item.cover);
    }

    if (item.description) {
        formData.append("description", item.description.ru);
    }

    if (item.coverAlt) {
        formData.append("coverAlt", item.coverAlt.ru);
    }

    if (item.seoTitle) {
        formData.append("seoTitle", item.seoTitle);
    }

    if (item.seoDescription) {
        formData.append("seoDescription", item.seoDescription);
    }

    await axiosAPI.patch("/superadmin/portfolio/" + id, formData);
}

export const editGalleryItem = async ({item, gallery_id}: {
    item: GalleryEditValues,
    gallery_id: string,
}) => {
    const formData = new FormData();

    if (item.image) {
        formData.append("gallery", item.image);
    }

    if (item.alt) {
        formData.append("alt", item.alt.ru);
    }

    await axiosAPI.patch("superadmin/portfolio/gallery/" + gallery_id, formData);
}

export const deletePortfolio = async (item_id: string) => {
    await axiosAPI.delete("superadmin/portfolio/" + item_id);
}

export const deleteGalleryItem = async (gallery_id: string) => {
    await axiosAPI.delete("superadmin/portfolio/gallery/" + gallery_id);
}