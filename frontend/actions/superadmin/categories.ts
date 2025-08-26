import kyAPI from "@/src/lib/kyAPI";
import {Category} from "@/src/lib/types";

export type CreateCategoryPayload = {
    title: {
        ru: string;
    };
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export const createCategory = async (data: CreateCategoryPayload) => {
    return await kyAPI
        .post("superadmin/categories", { json: data })
        .json<{ category: Category }>();
};

export const updateCategory = async (id: string, data: UpdateCategoryPayload) => {
    return await kyAPI
        .patch(`superadmin/categories/${id}`, { json: data })
        .json<{ category: Category }>();
};

export const deleteCategory = async (id: string) => {
    return await kyAPI
        .delete(`superadmin/categories/${id}`)
        .json<{ message: string }>();
};