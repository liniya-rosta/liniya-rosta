import axiosAPI from '@/lib/axiosAPI';
import {Category} from '@/lib/types';

export const fetchCategories = async () => {
    const res = await axiosAPI.get<Category[]>('/categories');
    return res.data;
};
