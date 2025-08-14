import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {fetchPostById, fetchPosts} from "@/actions/posts";
import {usePersistedPageSize} from "@/hooks/usePersistedPageSize";
import {toast} from "react-toastify";
import {ImageObject} from "@/src/lib/types";
import {reorderPostImages} from "@/actions/superadmin/posts";
import {handleKyError} from "@/src/lib/handleKyError";
import {useRouter, useSearchParams} from "next/navigation";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {fetchProductById, fetchProducts} from "@/actions/products";

export const useProductFetcher = () => {
    const {
        setProducts,
        setProductDetail,
        setPaginationProduct,
        setFetchLoading,
        setFetchError,
        setUpdateLoading,
    } = useAdminProductStore();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [pageSize, setPageSize] = usePersistedPageSize("admin_product_table_size");

    const [filters, setFilters] = useState({title: "", description: "", categoryId: undefined});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });

    const fetchData = async () => {
        try {
            const data = await fetchProducts({
                limit: pagination.pageSize.toString(),
                page: (pagination.pageIndex + 1).toString(),
                title: filters.title,
                description: filters.description,
                categoryId: filters.categoryId,
            });
            setProducts(data.items);
            setPaginationProduct({
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
            });
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении постов");
            setFetchError(msg);
        } finally {
            setFetchLoading(false)
        }
    };

    const fetchOneProduct = async (postId: string) => {
        try {
            const data = await fetchProductById(postId);
            setProductDetail(data);
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении поста");
            setFetchError(msg);
        } finally {
            setFetchLoading(false);
        }
    }

    const handleFilterChange = (column: string, value: string) => {
        setFilters((prev) => ({...prev, [column]: value}));
        setPagination((prev) => ({...prev, pageIndex: 0}));
    };

    const handleReorderImages = async (postId: string, newOrder: ImageObject[]) => {
        try {
            setUpdateLoading(true);
            await reorderPostImages(postId, newOrder);
            toast.success("Порядок изображений изменен");
            await fetchData();
        } catch (error) {
            const msg = handleKyError(error, "Ошибка при получении изображений");
            toast.error(msg);
        } finally {
            setUpdateLoading(false);
        }
    }

    const handlePaginationChange = (updater: React.SetStateAction<PaginationState>) => {
        const newState = typeof updater === "function" ? updater(pagination) : updater;
        setPagination(newState);
        setPageSize(newState.pageSize);
        router.push(`/admin/blog?page=${newState.pageIndex + 1}`);
    };

    return {
        searchParams,
        pagination,
        filters,
        pageSize,
        handlePaginationChange,
        setPagination,
        fetchData,
        fetchOneProduct,
        handleFilterChange,
        setPageSize,
        handleReorderImages,
    };
}