import axiosAPI from '@/lib/axiosAPI';
import {Category} from '@/lib/types';
import {isAxiosError} from "axios";

export const fetchCategories = async () => {
    try {
        const res = await axiosAPI.get<Category[]>('/categories');
        return res.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(e.response?.data || 'Произошла ошибка при получении категорий');
        }
        throw e;
    }
};
