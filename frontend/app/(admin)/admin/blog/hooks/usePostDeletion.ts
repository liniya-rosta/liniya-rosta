import {Dispatch, useState} from "react";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {isAxiosError} from "axios";
import {deletePost, deletePostImage} from "@/actions/superadmin/posts";
import {toast} from "react-toastify";
import {RowSelectionState} from "@tanstack/react-table";

export const usePostDeletion = (
    fetchData: () => Promise<void>,
    fetchOnePost: (id: string) => Promise<void>,
    setRowSelection: Dispatch<React.SetStateAction<RowSelectionState>>,
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
                await fetchOnePost(detailPost._id);
                await fetchData();
            } else {
                const postId = selectedToDelete[0];
                await deletePost(postId);
                await fetchData();
            }

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

    const handleDeleteSelectedPosts = async () => {
        setDeleteLoading(true);
        try {
            if (detailPost && isImageDelete) {
                await Promise.all(selectedToDelete.map(async imageUrl => deletePostImage(detailPost._id, imageUrl)));
                await fetchOnePost(detailPost._id);
                await fetchData();
            } else {
                await Promise.all(selectedToDelete.map(id => deletePost(id)));
                await fetchData();
            }
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
            setRowSelection({});
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
