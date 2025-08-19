import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {useCallback, useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {fetchPostById, fetchPosts} from "@/actions/posts";
import {usePersistedPageSize} from "@/hooks/usePersistedPageSize";
import {toast} from "react-toastify";
import {ImageObject} from "@/src/lib/types";
import {reorderPostImages} from "@/actions/superadmin/posts";
import {handleKyError} from "@/src/lib/handleKyError";
import {useRouter, useSearchParams} from "next/navigation";

export const usePostsFetcher = () => {
    const {
        setPosts,
        setDetailPost,
        setPaginationPost,
        setFetchLoading,
        setFetchError,
        setUpdateLoading,
    } = useSuperAdminPostStore();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [pageSize, setPageSize] = usePersistedPageSize("admin_post_table_size");

    const [filters, setFilters] = useState({title: "", description: ""});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });

    const fetchData = useCallback(async () => {
        try {
            const data = await fetchPosts(
                pagination.pageSize.toString(),
                (pagination.pageIndex + 1).toString(),
                filters.title,
                filters.description
            );
            setPosts(data.items);
            setPaginationPost({
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
            });
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении постов");
            setFetchError(msg);
        } finally {
            setFetchLoading(false);
        }
    }, [pagination.pageSize, pagination.pageIndex, filters.title, filters.description, setPosts, setPaginationPost, setFetchError, setFetchLoading]);

    const fetchOnePost = useCallback(async (postId: string) => {
        try {
            const data = await fetchPostById(postId);
            setDetailPost(data);
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении поста");
            setFetchError(msg);
        } finally {
            setFetchLoading(false);
        }
    }, [setDetailPost, setFetchError, setFetchLoading]);

    const handleFilterChange = useCallback((column: string, value: string) => {
        setFilters((prev) => ({ ...prev, [column]: value }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    const handleReorderImages = useCallback(async (postId: string, newOrder: ImageObject[]) => {
        try {
            setUpdateLoading(true);
            await reorderPostImages(postId, newOrder);
            toast.success("Порядок изображений изменен");
            await fetchData();
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при изменении порядка изображений");
            toast.error(msg);
        } finally {
            setUpdateLoading(false);
        }
    }, [fetchData, setUpdateLoading]);

    const handlePaginationChange = useCallback((updater: React.SetStateAction<PaginationState>) => {
        const newState = typeof updater === "function" ? updater(pagination) : updater;
        setPagination(newState);
        setPageSize(newState.pageSize);
        router.push(`/admin/blog?page=${newState.pageIndex + 1}`);
    }, [pagination, router, setPageSize]);

    return {
        searchParams,
        pagination,
        filters,
        pageSize,
        handlePaginationChange,
        setPagination,
        fetchData,
        fetchOnePost,
        handleFilterChange,
        setPageSize,
        handleReorderImages,
    };
}