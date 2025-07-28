import axiosAPI from '@/src/lib/axiosAPI';
import {Product} from '@/src/lib/types';

export const fetchProducts = async ({
                                        limit = "10",
                                        page = "1",
                                        title,
                                        description,
                                        categoryId,
                                        categoryExclude,
                                    }: {
    limit?: string;
    page?: string;
    title?: string;
    description?: string;
    categoryId?: string;
    categoryExclude?: string;
}) => {
    const query = new URLSearchParams();
    query.append("limit", limit);
    query.append("page", page);
    if (title) query.append("title", title);
    if (description) query.append("description", description);
    if (categoryId) query.append("category", categoryId);
    if (categoryExclude) query.append("categoryExclude", categoryExclude);

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