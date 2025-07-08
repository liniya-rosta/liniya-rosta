import React, {useCallback, useEffect, useState} from "react";
import {Product} from "@/lib/types";
import {fetchProductById} from "@/actions/products";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";

export function useProductsTableLogic(products: Product[]) {
    const {setUpdateError, setProductDetail} = useAdminProductStore();

    // фильтрация
    const [activeFilterType, setActiveFilterType] = React.useState<'title' | 'description'>('title'); // по какому полю фильтровать (в нашем случае title или description), изначально title
    const [filterValue, setFilterValue] = React.useState<string>(''); // для ввода инпута
    const [filteredProducts, setFilteredProducts] = React.useState<Product[]>(products); // отфильтрованные продукты по filterValue или activeFilterType

    useEffect(() => {
        if (filterValue.trim()) {
            const lower = filterValue.toLowerCase();
            const filtered = products.filter((product) => {
                return activeFilterType === "title"
                    ? product.title.toLowerCase().includes(lower)
                    : product.description?.toLowerCase().includes(lower);
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [products, filterValue, activeFilterType]);

    // модалки
    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);
    const [saleLabel, setSaleLabel] = useState<string | null>(null);
    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);

    const onImageClick = useCallback((image: { url: string; alt: string }) => {
        setPreviewImage(image);
    }, []);

    const onSaleLabelClick = useCallback((label: string) => {
        setSaleLabel(label);
    }, []);

    const onImages = useCallback(async (data: {
        productId: string;
        images: { url: string; alt?: string | null; _id: string }[];
    }) => {
        try {
            setUpdateError(null);
            const product = await fetchProductById(data.productId);
            setProductDetail(product);
            setIsImagesModalOpen(true);
        } catch (e) {
            if (isAxiosError(e)) {
                setUpdateError(e.response?.data?.error);
                toast.error(e.response?.data?.error);
            } else {
                toast.error("Неизвестная ошибка при получении продукта");
            }
        }
    }, [setUpdateError, setProductDetail]);

    return {
        activeFilterType, setActiveFilterType,
        filterValue, setFilterValue,
        filteredProducts,
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