import axiosAPI from '@/lib/axiosAPI';
import {Category} from '@/lib/types';

export const fetchCategories = async (slug?: string) => {
    const url = slug ? `/categories?slug=${slug}` : '/categories';
    const res = await axiosAPI.get<Category[]>(url);
    return res.data;
};