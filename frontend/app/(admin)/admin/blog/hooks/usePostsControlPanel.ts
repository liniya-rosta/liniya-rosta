import {useEffect, useState} from "react";
import {PostResponse} from "@/lib/types";
import {fetchPosts} from "@/actions/posts";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {AxiosError, isAxiosError} from "axios";
import {deletePost} from "@/actions/superadmin/posts";
import {PaginationState} from "@tanstack/react-table";
import {toast} from "react-toastify";

export const usePostsControlPanel = (
    data: PostResponse | null, error: string | null, limit: string = "10", pagination: PaginationState) => {
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
        setPageSize,
    } = useSuperAdminPostStore();

    const [isHydrating, setIsHydrating] = useState(true);
    const [fetchLoading, setLoading] = useState(false);

    const updatePaginationAndData = async (searchValue = "", searchField = "title") => {
        const filters = {
            title: "",
            description: "",
        };
        if (searchField === "title") filters.title = searchValue;
        if (searchField === "description") filters.description = searchValue;

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
        return data.items.length;
    };


    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const postId = selectedToDelete[0];
            await deletePost(postId);
            setPosts(posts.filter((p) => p._id !== postId));
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.error : "Ошибка при удалении";
            setDeleteError(message);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
        }
    };

    const handleDeleteSelectedPosts = async () => {
        setDeleteLoading(true);
        try {
            await Promise.all(selectedToDelete.map(id => deletePost(id)));
            setPosts(posts.filter((post) => !selectedToDelete.includes(post._id)));
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
        isHydrating,
        fetchLoading,
        fetchError: error,
        handleDelete,
        handleDeleteSelectedPosts,
        updatePaginationAndData,
    };
};
