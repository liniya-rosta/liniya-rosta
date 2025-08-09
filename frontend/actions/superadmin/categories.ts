import kyAPI from "@/src/lib/kyAPI";
import {Category} from "@/src/lib/types";

export type CreateCategoryPayload = {
    title: {
        ru: string;
    };
};

export const createCategory = async (data: CreateCategoryPayload) => {
    return await kyAPI
        .post("superadmin/categories", { json: data })
        .json<{ category: Category }>();
};