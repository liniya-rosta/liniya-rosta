import React, {Dispatch, useState} from "react";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {deletePost, deletePostImage} from "@/actions/superadmin/posts";
import {toast} from "react-toastify";
import {RowSelectionState} from "@tanstack/react-table";
import {handleKyError} from "@/src/lib/handleKyError";

export const usePostDeletion = (
    fetchOnePost?: (id: string) => Promise<void>,
    fetchData?: () => Promise<void>,
    setRowSelection?: Dispatch<React.SetStateAction<RowSelectionState>>,
) => {
    const {
        posts,
        detailPost,
        selectedToDelete,
        setSelectedToDelete,
        setDeleteLoading,
    } = useSuperAdminPostStore();

    const [isImageDelete, setImageDelete] = useState(false);

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            if (isImageDelete && detailPost) {
                await deletePostImage(detailPost._id, selectedToDelete[0]);
                if (fetchOnePost) await fetchOnePost(detailPost._id);
            } else {
                const postId = selectedToDelete[0];
                await deletePost(postId);
            }

            if (fetchData) await fetchData();
            toast.success(isImageDelete ? "Вы успешно удалили изображение" : "Вы успешно удалили пост");
        } catch (error) {
            const errorMessage = await handleKyError(error, 'Неизвестная ошибка при удалении поста');
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
            setImageDelete(false);
        }
    };

    const handleDeleteSelectedPosts = async () => {
        setDeleteLoading(true);
        try {
            if (detailPost && isImageDelete) {
                await Promise.all(selectedToDelete.map(async imageUrl => deletePostImage(detailPost._id, imageUrl)));
                if (fetchOnePost) await fetchOnePost(detailPost._id);
            } else {
                await Promise.all(selectedToDelete.map(id => deletePost(id)));
            }

            if (fetchData) await fetchData();
            toast.success(isImageDelete ? "Вы успешно удалили изображения" : "Вы успешно удалили посты");
        } catch (error) {
            const errorMessage = await handleKyError(error, 'Неизвестная ошибка при удалении выбранных поста');
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
            if (setRowSelection) setRowSelection({});
        }
    };

    return {
        posts,
        isImageDelete,
        handleDelete,
        handleDeleteSelectedPosts,
        setImageDelete,
    };
};
