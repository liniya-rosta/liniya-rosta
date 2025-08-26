import { useState } from "react";
import { getPaginationButtons } from "@/src/lib/utils";
import { handleKyError } from "@/src/lib/handleKyError";
import { useProductStore } from "@/store/productsStore";
import { fetchProducts } from "@/actions/products";
import { ProductResponse } from "@/src/lib/types";

export const useProductFetcher = (limit: string, categorySpc: string) => {
    const {
        paginationProducts,
        setFetchProductsLoading,
        setPaginationProducts,
        setFetchProductsError,
        setProducts,
    } = useProductStore();

    const [page, setPage] = useState(1);
    const [categoryId, setCategoryId] = useState<string>("all");
    const [searchTitle, setSearchTitle] = useState<string>("");
    let paginationButtons: (string | number)[] | null = null;

    if (paginationProducts) {
        paginationButtons = getPaginationButtons(page, paginationProducts.totalPages);
    }

    const updatedData = async (
        initialData?: ProductResponse | null,
        newPage: number = 1,
        overrideCategoryId?: string,
        overrideTitle?: string
    ) => {
        try {
            setFetchProductsLoading(true);
            let data: ProductResponse;

            const currentCategory = overrideCategoryId ?? categoryId;
            const currentTitle = overrideTitle ?? searchTitle;

            if (initialData) {
                data = initialData;
            } else {
                const query: Record<string, string> = {
                    limit,
                    page: String(newPage),
                };

                if (currentCategory === "all") {
                    query.categoryExclude = categorySpc;
                } else {
                    query.categoryId = currentCategory;
                }

                if (currentTitle.trim()) {
                    query.title = currentTitle.trim();
                }

                setPage(newPage);
                data = await fetchProducts(query);
            }

            setProducts(data.items);
            setPaginationProducts({
                total: data.total,
                page: data.page,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
            });
            setFetchProductsError(null);
        } catch (error) {
            const errorMessage = await handleKyError(error, "Неизвестная ошибка при загрузке товаров");
            setFetchProductsError(errorMessage);
        } finally {
            setFetchProductsLoading(false);
        }
    };

    const handlePageChange = async (newPage: number) => {
        await updatedData(null, newPage);
        setPage(newPage);
    };

    const handleSearch = async (title: string, categoryId: string) => {
        setSearchTitle(title);
        await updatedData(null, 1, categoryId, title);
    };

    return {
        page,
        setPage,
        categoryId,
        setCategoryId,
        updatedData,
        handlePageChange,
        paginationButtons,
        searchTitle,
        setSearchTitle,
        handleSearch,
    };
};
