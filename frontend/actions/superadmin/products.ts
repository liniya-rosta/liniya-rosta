import {Product, ProductMutation} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";
import {UpdateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import ky from "ky";

export const createProduct = async (productData: ProductMutation): Promise<Product> => {
    const formData = new FormData();
    formData.append('category', productData.category);
    formData.append('title', productData.title.ru);

    if (productData.description) {
        formData.append('description', productData.description.ru);
    }

    if (productData.seoTitle) {
        formData.append('seoTitle', productData.seoTitle.ru);
    }

    if (productData.seoDescription) {
        formData.append('seoDescription', productData.seoDescription.ru);
    }

    if (productData.cover) {
        formData.append('cover', productData.cover);
    }

    if (productData.coverAlt) {
        formData.append('coverAlt', productData.coverAlt.ru);
    }

    if (productData.images) {
        productData.images.forEach((img) => {
            if (img.image instanceof File) {
                formData.append("images", img.image);
                formData.append("alt", img.alt?.ru || "Элемент галереи");
            }
        });
    }

    if (productData.characteristics) {
        formData.append('characteristics', JSON.stringify(productData.characteristics));
    }

    if (productData.sale) {
        formData.append('isOnSale', String(productData.sale.isOnSale));
        if (productData.sale.label) {
            formData.append('saleLabel', productData.sale.label);
        }
    }

    if (productData.icon instanceof File) {
        formData.append('icon', productData.icon);
    }

    if (productData.iconAlt) {
        formData.append('iconAlt', productData.iconAlt.ru);
    }

    const data = await kyAPI.post('superadmin/products', {body: formData}).json<{
        message: string,
        product: Product
    }>();
    return data.product;
};

export const updateProduct = async (id: string, productData: UpdateProductFormData, mode: "replace" | "append" = "replace"): Promise<Product> => {
    const formData = new FormData();

    if (productData.category) formData.append('category', productData.category);
    if (productData.title) formData.append('title', productData.title.ru);
    if (productData.description) formData.append('description', productData.description.ru);
    if (productData.seoTitle) formData.append('seoTitle', productData.seoTitle.ru);
    if (productData.seoDescription) formData.append('seoDescription', productData.seoDescription.ru);
    if (productData.cover) formData.append('cover', productData.cover);
    if (productData.coverAlt) formData.append('coverAlt', productData.coverAlt.ru);
    if (productData.characteristics) formData.append('characteristics', JSON.stringify(productData.characteristics));
    if (productData.sale) {
        formData.append('isOnSale', String(productData.sale.isOnSale));
        if (productData.sale.label) {
            formData.append('saleLabel', productData.sale.label);
        }
    }
    if (productData.icon instanceof File) formData.append('icon', productData.icon);
    if (productData.iconAlt) formData.append('iconAlt', productData.iconAlt.ru);

    formData.append("mode", mode);

    productData.images?.forEach((img) => {
        if (img.image instanceof File) {
            formData.append("images", img.image);
            formData.append("alts", img.alt?.ru || "");
        }
    });

    const data = await kyAPI.patch(
        `superadmin/products/${id}`, {body: formData}).json<{ message: string, product: Product }>();
    return data.product;
};

export const updateProductImage = async (imageId: string, file: File | null, alt?: string): Promise<Product> => {
    const formData = new FormData();
    if (file) formData.append("images", file);
    if (alt) formData.append("alt", alt);

    const data = await kyAPI.patch(`superadmin/products/images/${imageId}`, {body: formData}).json<{
        product: Product
    }>();
    return data.product;
};

export const deleteProductImage = async (imageId: string): Promise<string> => {
    const data = await kyAPI.delete(`superadmin/products/images/${imageId}`).json<{ message: string }>();
    return data.message;
};

export const deleteProduct = async (id: string): Promise<string> => {
    const data = await kyAPI.delete(`superadmin/products/${id}`).json<{ message: string }>();
    return data.message;
};

export const fetchProductsAdmin = async ({
                                             // limit = "10",
                                             // page = "1",
                                             // title,
                                             // description,
                                             // categoryId,
                                             // categoryExclude,
                                         }: {
    limit?: string;
    page?: string;
    title?: string;
    description?: string;
    categoryId?: string;
    categoryExclude?: string;
}) => {
    // const query = new URLSearchParams();
    //
    // query.append("limit", limit);
    // query.append("page", page);
    // if (title) query.append("title", title);
    // if (description) query.append("description", description);
    // if (categoryId) query.append("category", categoryId);
    // if (categoryExclude) query.append("categoryExclude", categoryExclude);

    return await ky.get(`/api/products/`).json<{
        items: Product[];
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }>();
};