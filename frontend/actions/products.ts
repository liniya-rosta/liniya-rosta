import axiosAPI from '@/src/lib/axiosAPI';
import {Product} from '@/src/lib/types';

export const fetchProducts = async (
    limit = "10",
    page = "1",
    title?: string,
    description?: string,
    categoryId?: string
) => {
    const query = new URLSearchParams();
    if (limit) query.append("limit", limit);
    if (page) query.append("page", page);
    if (title) query.append("title", title);
    if (description) query.append("description", description);
    if (categoryId) query.append("category", categoryId);

    const res = await axiosAPI.get<{
        items: Product[];
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }>(`/products?${query.toString()}`);

    return res.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
    const res = await axiosAPI.get<Product>(`/products/${id}`);
    return res.data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
    const res = await axiosAPI.get<Product>(`/products/slug/${slug}`);
    return res.data;
};