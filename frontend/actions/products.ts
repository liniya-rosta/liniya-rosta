import axiosAPI from '@/lib/axiosAPI';
import { Product, ProductWithoutId } from '@/lib/types';
import { isAxiosError } from "axios";

export const fetchProducts = async (categoryId?: string) => {
    const url = categoryId ? `/products?category=${categoryId}` : '/products';
    const res = await axiosAPI.get<Product[]>(url);
    return res.data;
};

export const fetchProductById = async (id: string): Promise<Product> => { // Добавляем Promise<Product>
    try {
        const res = await axiosAPI.get<Product>(`/products/${id}`);
        return res.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data?.message || 'Произошла ошибка при получении продукта');
        }
        throw e;
    }
};

export const createProduct = async (productData: ProductWithoutId, imageFile?: File): Promise<Product> => { // Добавляем Promise<Product>
    try {
        const formData = new FormData();
        formData.append('category', productData.category);
        formData.append('title', productData.title);

        if (productData.description) {
            formData.append('description', productData.description);
        }

        if (imageFile) {
            formData.append('image', imageFile);
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

export const updateProduct = async (id: string, productData: Partial<ProductWithoutId>, imageFile?: File): Promise<Product> => { // Добавляем Promise<Product>
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

        if (imageFile) {
            formData.append('image', imageFile);
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

export const deleteProduct = async (id: string): Promise<string> => { // Добавляем Promise<string>
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