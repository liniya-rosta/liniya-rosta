import {useEffect, useState} from "react";
import {PostResponse} from "@/lib/types";
import {fetchPosts} from "@/actions/posts";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {AxiosError, isAxiosError} from "axios";
import {deletePost, deletePostImage} from "@/actions/superadmin/posts";
import {PaginationState} from "@tanstack/react-table";
import {toast} from "react-toastify";

export const usePostsControlPanel = (limit: string) => {
    const {
        posts,
        selectedToDelete,
        setSelectedToDelete,
        setPosts,
        setPaginationPost,
        setFetchLoading,
        setDeleteLoading,
        setFetchError,
        setDeleteError,
    } = useSuperAdminPostStore();

    const [filters, setFilters] = useState({title: "", description: ""});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: Number(limit),
    });

    const fetchData = async () => {
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
    };

    const handleFilterChange = (column: string, value: string) => {
        setFilters((prev) => ({...prev, [column]: value}));
        setPagination((prev) => ({...prev, pageIndex: 0}));
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const postId = selectedToDelete[0];
            await deletePost(postId);
            await fetchData();
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.error : "Ошибка при удалении";
            setDeleteError(message);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
        }
    };

    const handleDeleteImage = async (postId: string, imageUrl: string) => {
        try {
            setDeleteLoading(true);
            await deletePostImage(postId, imageUrl);
            await fetchData();
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.error : "Ошибка при удалении";
            setDeleteError(message);
        } finally {
            setDeleteLoading(true);
        }
    }

    const handleDeleteSelectedPosts = async () => {
        setDeleteLoading(true);
        try {
            await Promise.all(selectedToDelete.map(id => deletePost(id)));
            await fetchData();
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.error : "Ошибка при удалении";
            setDeleteError(message);
            toast.error(message);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
        }
    };

    return {
        posts,
        pagination,
        setPagination,
        fetchData,
        handleDelete,
        handleDeleteSelectedPosts,
        handleDeleteImage,
        handleFilterChange,
        filters,
    };
};
