import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/actions/products";
import { toast } from "react-toastify";
import { handleKyError } from "@/src/lib/handleKyError";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {usePersistedPageSize} from "@/hooks/usePersistedPageSize";

export type FilterType = "title" | "description";

export function useProductsQuery() {
    const {products, setProducts, productPagination, setProductPagination } = useAdminProductStore();

    const searchParams = useSearchParams();
    const router = useRouter();

    const initialPage = Number(searchParams.get("page")) || productPagination?.page || 1;

    const [pageSize, setPageSize] = usePersistedPageSize("admin_product_table_size");
    const [pageIndex, setPageIndex] = useState(initialPage - 1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filterType, setFilterType] = useState<FilterType>("title");
    const [filterValue, setFilterValue] = useState("");
    const [categoryId, setCategoryId] = useState<string | null>(null);

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", (pageIndex + 1).toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [pageIndex, router]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchProducts({
                    limit: String(pageSize),
                    page: String(pageIndex + 1),
                    title: filterType === "title" ? filterValue : undefined,
                    description: filterType === "description" ? filterValue : undefined,
                    categoryId: categoryId || undefined,
                });

                if (data.totalPages > 0 && pageIndex + 1 > data.totalPages) {
                    setPageIndex(data.totalPages - 1);
                    return;
                }

                setProducts(data.items);

                setProductPagination({
                    page: data.page,
                    pageSize: data.pageSize,
                    total: data.total,
                    totalPages: data.totalPages,
                });

            } catch (e) {
                const message = await handleKyError(e, "Ошибка при загрузке продуктов");
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [filterType, filterValue, categoryId, pageIndex, pageSize, refreshKey, setProductPagination]);

    return {
        products,
        loading,
        error,
        filterType,
        setFilterType,
        filterValue,
        setFilterValue,
        categoryId,
        setCategoryId,
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize,
        totalPages: productPagination?.totalPages || 0,
        totalItems: productPagination?.total || 0,
        refresh: () => setRefreshKey(prev => prev + 1),
    };
}