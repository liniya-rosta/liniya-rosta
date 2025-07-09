import {useEffect, useState} from "react";
import {fetchProducts} from "@/actions/products";
import {Product} from "@/lib/types";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";

export type FilterType = "title" | "description";

export function useProductsQuery() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filterType, setFilterType] = useState<FilterType>("title");
    const [filterValue, setFilterValue] = useState("");
    const [categoryId, setCategoryId] = useState<string | null>(null);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchProducts(
                    String(pageSize),
                    String(pageIndex + 1),
                    filterType === "title" ? filterValue : undefined,
                    filterType === "description" ? filterValue : undefined,
                    categoryId || undefined
                );

                setProducts(data.items);
                setTotalPages(data.totalPages);
            } catch (e) {
                const message =
                    isAxiosError(e) && e.response?.data?.error
                        ? e.response.data.error
                        : "Ошибка при загрузке продуктов";

                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filterType, filterValue, categoryId, pageIndex, pageSize]);

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
        totalPages,
    };
}