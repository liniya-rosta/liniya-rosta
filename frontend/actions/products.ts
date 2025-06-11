import axiosAPI from '@/lib/axiosAPI';
import {Product} from '@/lib/types';
import {isAxiosError} from "axios";

export const fetchProducts = async (categoryId?: string) => {
    try {
        let url = '/products';
        if (categoryId) {
            url += `?category=${categoryId}`;
        }
        const res = await axiosAPI.get<Product[]>(url);
        return res.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data || 'Произошла ошибка при получении продуктов');
        }
        throw e;
    }
};
