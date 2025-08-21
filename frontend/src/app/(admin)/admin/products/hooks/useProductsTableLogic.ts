import {useCallback, useState} from "react";
import {fetchProductById} from "@/actions/products";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {toast} from "react-toastify";
import {handleKyError} from "@/src/lib/handleKyError";

export function useProductsTableLogic() {
    const {setUpdateError, setProductDetail} = useAdminProductStore();

    // Модалки
    const [previewImage, setPreviewImage] = useState<{ url: string; alt: { ru: string, ky: string } } | null>(null);
    const [saleLabel, setSaleLabel] = useState<string | null>(null);
    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

    const onImageClick = useCallback((image: { url: string; alt: { ru: string, ky: string } }) => {
        setPreviewImage(image);
    }, []);

    const onSaleLabelClick = useCallback((label: string) => {
        setSaleLabel(label);
    }, []);

    const onImages = useCallback(async (data: {
        productId: string;
        images: { image: string; alt?: { ru: string, ky: string } | null; _id?: string }[];
    }) => {
        try {
            setUpdateError(null);
            const product = await fetchProductById(data.productId);
            setProductDetail(product);
            setIsImagesModalOpen(true);
        } catch (e) {
            const msg = await handleKyError(e, 'Ошибка при получении продукта');
            setUpdateError(msg);
            toast.error(msg);
        }
    }, [setUpdateError, setProductDetail]);

    return {
        previewImage, setPreviewImage,
        saleLabel, setSaleLabel,
        isImagesModalOpen, setIsImagesModalOpen,
        showConfirmDialog, setShowConfirmDialog,
        idsToDelete, setIdsToDelete,
        onImageClick,
        onSaleLabelClick,
        onImages,
    };
}