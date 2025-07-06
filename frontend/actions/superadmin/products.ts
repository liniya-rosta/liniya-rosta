import {Product, ProductMutation, ProductUpdateMutation} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";
import {isAxiosError} from "axios";

export const createProduct = async (productData: ProductMutation): Promise<Product> => {
    const formData = new FormData();
    formData.append('category', productData.category);
    formData.append('title', productData.title);

    if (productData.description) {
        formData.append('description', productData.description);
    }

    if (productData.cover) {
        formData.append('cover', productData.cover);
    }

    if (productData.coverAlt) {
        formData.append('coverAlt', productData.coverAlt);
    }

    productData.images.forEach((img) => {
        if (img.url instanceof File) {
            formData.append("images", img.url);
            formData.append("alt", img.alt || "Элемент галереи");
        }
    });

    if (productData.characteristics) {
        formData.append('characteristics', JSON.stringify(productData.characteristics));
    }

    if (productData.sale) {
        formData.append('isOnSale', String(productData.sale.isOnSale));
        if (productData.sale.label) {
            formData.append('saleLabel', productData.sale.label);
        }
    }

    if (productData.icon) {
        formData.append('icon', productData.icon);
    }

    if (productData.iconAlt) {
        formData.append('iconAlt', productData.iconAlt);
    }

    const res = await axiosAPI.post<{ message: string, product: Product }>('/superadmin/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data.product;
};

export const updateProduct = async (id: string, productData: ProductUpdateMutation): Promise<Product> => {
    const formData = new FormData();

    if (productData.category) {
        formData.append('category', productData.category);
    }

    if (productData.title) {
        formData.append('title', productData.title);
    }

    if (productData.description) {
        formData.append('description', productData.description);
    }

    if (productData.cover) {
        formData.append('cover', productData.cover);
    }

    if (productData.coverAlt) {
        formData.append('coverAlt', productData.coverAlt);
    }

    productData.images?.forEach((img) => {
        if (img.url instanceof File) {
            formData.append("images", img.url);
            formData.append("alt", img.alt || "Элемент галереи");
        }
    });

    if (productData.characteristics) {
        formData.append('characteristics', JSON.stringify(productData.characteristics));
    }

    if (productData.sale) {
        formData.append('isOnSale', String(productData.sale.isOnSale));
        if (productData.sale.label) {
            formData.append('saleLabel', productData.sale.label);
        }
    }

    if (productData.icon instanceof File) {
        formData.append('icon', productData.icon);
    }

    if (productData.iconAlt) {
        formData.append('iconAlt', productData.iconAlt);
    }

    const res = await axiosAPI.patch<{ message: string, product: Product }>(
        `/superadmin/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return res.data.product;
};

export const updateProductImage = async (
        imageId: string,
        file?: File,
        alt?: string
    ): Promise<Product> => {
        const formData = new FormData();
        if (file) formData.append("images", file);
        if (alt) formData.append("alt", alt);

        const res = await axiosAPI.patch<{ product: Product }>(
            `/superadmin/products/images/${imageId}`,
            formData,
            {headers: {"Content-Type": "multipart/form-data"}}
        );

        return res.data.product;
    }
;

export const deleteProductImage = async (imageId: string): Promise<string> => {
    const res = await axiosAPI.delete<{ message: string }>(`/superadmin/products/images/${imageId}`);
    return res.data.message;
};

export const deleteProduct = async (id: string): Promise<string> => {
    try {
        const res = await axiosAPI.delete<{ message: string }>(`/superadmin/products/${id}`);
        return res.data.message;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.error || 'Произошла ошибка при удалении продукта');
        }
        throw e;
    }
};