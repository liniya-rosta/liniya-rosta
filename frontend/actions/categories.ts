import {Category} from '@/src/lib/types';
import kyAPI from "@/src/lib/kyAPI";

export const fetchCategories = async (slug?: string) => {
    const url = slug ? `categories?slug=${slug}` : 'categories';
    return await kyAPI.get(url).json<Category[]>();
};