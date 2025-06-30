import {Product, ProductMutation, ProductUpdateMutation} from "@/lib/types";
import axiosAPI from "@/lib/axiosAPI";
import {isAxiosError} from "axios";

export const createProduct = async (productData: ProductMutation, coverFile?: File): Promise<Product> => {
    try {
        const formData = new FormData();
        formData.append('category', productData.category);
        formData.append('title', productData.title);

        if (productData.description) {
            formData.append('description', productData.description);
        }

        if (coverFile) {
            formData.append('cover', coverFile);
        }

        if (productData.coverAlt) {
            formData.append('coverAlt', productData.coverAlt);
        }

        if (productData.images) {
            formData.append('images', JSON.stringify(productData.images));
        }

        if (productData.characteristics) {
            formData.append('characteristics', JSON.stringify(productData.characteristics));
        }

        if (productData.sale) {
            formData.append('sale', JSON.stringify(productData.sale));
        }

        if (productData.icon) {
            formData.append('icon', JSON.stringify(productData.icon));
        }

        const res = await axiosAPI.post<{ message: string, product: Product }>('/superadmin/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.product;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.error || 'Произошла ошибка при создании продукта');
        }
        throw e;
    }
};

export const updateProduct = async (id: string, productData: ProductUpdateMutation, coverFile?: File): Promise<Product> => { // Добавляем Promise<Product>
    try {
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

        if (coverFile) {
            formData.append('cover', coverFile);
        }

        if (productData.coverAlt) {
            formData.append('coverAlt', productData.coverAlt);
        }

        if (productData.images?.length) {
            formData.append('images', JSON.stringify(productData.images));
        }

        if (productData.characteristics) {
            formData.append('characteristics', JSON.stringify(productData.characteristics));
        }

        if (productData.sale) {
            formData.append('sale', JSON.stringify(productData.sale));
        }

        if (productData.icon) {
            if (productData.icon.url) formData.append('iconUrl', productData.icon.url);
            if (productData.icon.alt) formData.append('iconAlt', productData.icon.alt);
        }

        const res = await axiosAPI.patch<{
            message: string,
            product: Product
        }>(`/superadmin/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data.product;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.error || 'Произошла ошибка при обновлении продукта');
        }
        throw e;
    }
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