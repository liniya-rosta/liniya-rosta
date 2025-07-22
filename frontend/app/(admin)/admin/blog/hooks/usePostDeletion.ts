import React, {Dispatch, useState} from "react";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {isAxiosError} from "axios";
import {deletePost, deletePostImage} from "@/actions/superadmin/posts";
import {toast} from "react-toastify";
import {PaginationState, RowSelectionState} from "@tanstack/react-table";

export const usePostDeletion = (
    fetchOnePost?: (id: string) => Promise<void>,
    fetchData?: () => Promise<void>,
    setRowSelection?: Dispatch<React.SetStateAction<RowSelectionState>>,
    pagination?: PaginationState,
    setPagination?: Dispatch<React.SetStateAction<PaginationState>>,
) => {
    const {
        posts,
        detailPost,
        selectedToDelete,
        setSelectedToDelete,
        setDeleteLoading,
    } = useSuperAdminPostStore();

    const [isImageDelete, setImageDelete] = useState(false);

    const goToPrevPage = () => {
        if (pagination && setPagination && posts.length === 1 && pagination.pageIndex > 0) {
            const newPagination = {
                ...pagination,
                pageIndex: pagination.pageIndex - 1,
            };
            setPagination(newPagination);
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            if (isImageDelete && detailPost) {
                await deletePostImage(detailPost._id, selectedToDelete[0]);
                if(fetchOnePost) await fetchOnePost(detailPost._id);
            } else {
                const postId = selectedToDelete[0];
                await deletePost(postId);
                goToPrevPage();
            }

            if(fetchData) await fetchData();
            toast.success(isImageDelete ? "Вы успешно удалили изображение" : "Вы успешно удалили пост");
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при удалении";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
            setImageDelete(false);
        }
    };

    const multipleDeletion = async () => {
        setDeleteLoading(true);
        try {
            if (detailPost && isImageDelete) {
                await Promise.all(selectedToDelete.map(async imageUrl => deletePostImage(detailPost._id, imageUrl)));
                if (fetchOnePost) await fetchOnePost(detailPost._id);
            } else {
                await Promise.all(selectedToDelete.map(id => deletePost(id)));
                goToPrevPage();
            }

            if(fetchData) await fetchData();
            toast.success(isImageDelete ? "Вы успешно удалили изображения" : "Вы успешно удалили посты");
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при удалении";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
            if(setRowSelection) setRowSelection({});
        }
    };

    return {
        posts,
        isImageDelete,
        handleDelete,
        multipleDeletion,
        setImageDelete,
    };
};