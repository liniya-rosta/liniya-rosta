import {Product} from '@/src/lib/types';
import kyAPI from "@/src/lib/kyAPI";


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

    return await kyAPI.get(`products/?${query.toString()}`).json<{
        items: Product[];
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }>();
};

export const fetchProductById = async (id: string): Promise<Product> => {
    return await kyAPI.get(`products/${id}`).json<Product>();
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
    return await kyAPI.get(`products/slug/${slug}`).json<Product>();
};