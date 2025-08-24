import {useState} from "react";
import {getPaginationButtons} from "@/src/lib/utils";
import {handleKyError} from "@/src/lib/handleKyError";
import {useProductStore} from "@/store/productsStore";
import {fetchProducts} from "@/actions/products";
import {ProductResponse} from "@/src/lib/types";

export const useProductFetcher = (limit: string, categorySpc: string) => {
    const {
        paginationProducts,
        setFetchProductsLoading,
        setPaginationProducts,
        setFetchProductsError,
        setProducts,
    } = useProductStore();

    const [page, setPage] = useState(1);
    let paginationButtons: (string | number)[] | null = null;

    if (paginationProducts)
        paginationButtons = getPaginationButtons(page, paginationProducts.totalPages);


    const updatedData = async (initialData?: ProductResponse | null, newPage?: number, categoryId?: string) => {
        try {
            setFetchProductsLoading(true);
            let data: ProductResponse;

            if (initialData) {
                data = initialData;
            } else {
                if (categoryId === "all") {
                    data = await fetchProducts({limit, page: String(newPage), categoryExclude: categorySpc});
                } else {
                    data = await fetchProducts({limit, categoryId, page: String(newPage)});
                }
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
            const errorMessage = await handleKyError(error, "Неизвестная ошибка при загрузке постов");
            setFetchProductsError(errorMessage);
        } finally {
            setFetchProductsLoading(false);
        }
    }


    const handlePageChange = async (newPage: number) => {
        await updatedData(null, newPage);
        setPage(newPage);
    };

    return {
        page,
        setPage,
        updatedData,
        handlePageChange,
        paginationButtons,
    };
};
