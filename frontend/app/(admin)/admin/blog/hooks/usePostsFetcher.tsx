import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {fetchPostById, fetchPosts} from "@/actions/posts";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {usePersistedPageSize} from "@/app/hooks/usePersistedPageSize";

export const PostsFetcher = () => {
    const {
        posts,
        setPosts,
        setDetailPost,
        setPaginationPost,
        setFetchLoading,
    } = useSuperAdminPostStore();

    const [pageSize, setPageSize] = usePersistedPageSize("admin_post_table_size");

    const [filters, setFilters] = useState({title: "", description: ""});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });

    const fetchData = async () => {
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
        } catch (err) {
            let errorMessage = "Ошибка при получении данных";
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setFetchLoading(false)
        }
    };

    const fetchOnePost = async (postId: string) => {
        try {
            const data = await fetchPostById(postId);
            setDetailPost(data);
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при получении данных";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        }
    }

    const handleFilterChange = (column: string, value: string) => {
        setFilters((prev) => ({...prev, [column]: value}));
        setPagination((prev) => ({...prev, pageIndex: 0}));
    };

    return {
        posts,
        pagination,
        filters,
        pageSize,
        setPagination,
        fetchData,
        fetchOnePost,
        handleFilterChange,
        setPageSize,
    };
}