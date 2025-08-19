import {deletePost, deletePostImage} from "@/actions/superadmin/posts";
import {PaginationState, RowSelectionState} from "@tanstack/react-table";
import React, {Dispatch, useState} from "react";
import {toast} from "react-toastify";
import {handleKyError} from "@/src/lib/handleKyError";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";

interface UsePostDeletionProps {
    pagination: PaginationState;
    setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
    fetchData?: () => Promise<void>;
    fetchOneProduct?: (id: string) => Promise<void>;
    setRowSelection?: Dispatch<RowSelectionState>;
}

export const useProductDeletion = ({
                                       pagination,
                                       setPagination,
                                       fetchData,
                                       fetchOneProduct,
                                       setRowSelection,
                                   }: UsePostDeletionProps) => {
    const {
        products,
        productDetail,
        selectedToDelete,
        setSelectedToDelete,
        setDeleteLoading,
    } = useAdminProductStore();

    const [isImageDelete, setImageDelete] = useState(false);

    const goToPreviousPageIfEmpty = (): boolean => {
        if (products.length === 1 && pagination.pageIndex > 0 && setPagination) {
            setPagination(prev => ({...prev, pageIndex: prev.pageIndex - 1}));
            return true;
        }
        return false;
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            if (isImageDelete && productDetail) {
                if (productDetail.images.length === 1) {
                    toast.error("Нельзя удалить последнее изображение");
                    return;
                }
                await deletePostImage(productDetail._id, selectedToDelete[0]);
                if (fetchOneProduct) await fetchOneProduct(productDetail._id);
            } else {
                const postId = selectedToDelete[0];
                await deletePost(postId);
            }

            const changedPage = goToPreviousPageIfEmpty();
            if (!changedPage && fetchData) await fetchData();

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

    const multipleDeletion = async () => {
        setDeleteLoading(true);
        try {
            if (productDetail && isImageDelete) {
                await Promise.all(selectedToDelete.map(img => deletePostImage(productDetail._id, img)));
                if (fetchOneProduct) await fetchOneProduct(productDetail._id);
            } else {
                await Promise.all(selectedToDelete.map(id => deletePost(id)));
            }

            const isLastPage = products.length === selectedToDelete.length && pagination.pageIndex > 0 && setPagination;
            if (isLastPage) {
                setPagination?.(prev => ({...prev, pageIndex: prev.pageIndex - 1}));
            } else {
                if (fetchData) await fetchData();
            }

            toast.success(isImageDelete ? "Вы успешно удалили изображения" : "Вы успешно удалили посты");
        } catch (error) {
            const errorMessage = await handleKyError(error, 'Неизвестная ошибка при удалении выбранных поста');
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
            setSelectedToDelete([]);
            setRowSelection?.({});
        }
    };

    return {
        products,
        isImageDelete,
        handleDelete,
        multipleDeletion,
        setImageDelete,
    };
};