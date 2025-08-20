"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {Checkbox} from "@/src/components/ui/checkbox";
import {Card, CardContent, CardFooter} from "@/src/components/ui/card";
import {toast} from "react-toastify";
import {IMG_BASE} from "@/src/lib/globalConstants";
import {deleteProductImage,} from "@/actions/superadmin/products";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {fetchProductById} from "@/actions/products";
import {handleKyError} from "@/src/lib/handleKyError";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ImagesEditForm from "@/src/app/(admin)/admin/products/edit-product/components/ImagesEditForm";

interface Props {
    open: boolean;
    onClose: () => void;
}

const ImagesModal: React.FC<Props> = ({open, onClose}) => {
    const {productDetail, setProductDetail, setProducts, products, setUpdateError} = useAdminProductStore();

    const images = productDetail?.images ?? [];
    const productId = productDetail?._id ?? "";

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
        );
    };

    const clearSelection = () => {
        setSelectedIds([]);
        setSelectionMode(false);
    };

    const handleEditClick = (id: string) => {
        const img = images.find((i) => i._id === id);
        if (img) {
            setEditingId(id);
        }
    };

    const handleDelete = async (ids: string[]) => {
        try {
            await Promise.all(ids.map((id) => deleteProductImage(id)));
            toast.success("Удаление успешно");
            clearSelection();
            setSelectedIds([]);
            await refreshProduct();

            if (images.length === ids.length) {
                setProductDetail(null);
                onClose();
            }
        } catch (e) {
            toast.error("Ошибка при удалении");
            console.error(e);
        }
    };

    const refreshProduct = React.useCallback(async () => {
        if (!productId) return null;
        try {
            const product = await fetchProductById(productId);
            setProductDetail(product);
            setProducts(
                products.map((p) =>
                    p._id === product._id ? product : p
                )
            );
        } catch (e) {
            const msg = await handleKyError(e, "Ошибка при обновлении изображений");
            setUpdateError(msg);
            toast.error(msg);
            return null;
        }
    }, [productId, setProductDetail, setProducts, setUpdateError]);

    useEffect(() => {
        if (open && productId) {
            void refreshProduct();
        }
    }, [open, productId, refreshProduct]);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    clearSelection();
                    onClose();
                }
            }}
        >
            <DialogContent className="!w-auto !max-w-6xl">
                <DialogHeader className="flex justify-between items-center gap-4">
                    <DialogTitle>Галерея изображений</DialogTitle>
                    <div className="flex gap-2">
                        {selectionMode ? (
                            <>
                                <Button
                                    variant="destructive"
                                    disabled={selectedIds.length === 0}
                                    onClick={() => handleDelete(selectedIds)}
                                >
                                    Удалить выбранные ({selectedIds.length})
                                </Button>
                                <Button variant="outline" onClick={clearSelection}>
                                    Отменить выбор
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setSelectionMode(true)}>
                                Выбрать изображения
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-2">
                        {images.map((item) => {
                            if (!item._id) return null;
                            const imageUrl = `${IMG_BASE}/${item.image}`;
                            const isSelected = selectedIds.includes(item._id);
                            return (
                                <Card
                                    key={item._id}
                                    className={`w-full h-full flex flex-col transition
                                        ${selectionMode ? "cursor-pointer" : ""}
                                        ${isSelected ? "ring-2 ring-primary" : ""}`}
                                    onClick={() => {
                                        if (selectionMode && item._id) toggleSelect(item._id);
                                    }}
                                >
                                    <a
                                        href={imageUrl}
                                        onClick={(e) => e.preventDefault()}
                                        className={`block relative w-full h-48 rounded-t overflow-hidden ${selectionMode ? "cursor-pointer" : "cursor-default"}`}
                                    >
                                        {selectionMode && (
                                            <div className="absolute z-10 top-2 left-2">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => {
                                                        if (item._id) toggleSelect(item._id)}
                                                    }
                                                />
                                            </div>
                                        )}
                                        <Image
                                            src={imageUrl}
                                            alt={item.alt?.ru || "Изображение"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        />
                                    </a>

                                    <CardContent className="flex-1">
                                        <div className="text-sm text-gray-700 line-clamp-2">{item.alt?.ru || "—"}</div>
                                    </CardContent>

                                    <CardFooter className="flex justify-between gap-2 px-3 pb-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (item._id) handleEditClick(item._id)
                                            }}
                                            disabled={selectionMode}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setImageToDelete(item._id!)}
                                            disabled={selectionMode}
                                        >
                                            Удалить
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center py-4">Нет изображений</p>
                )}
                <ConfirmDialog
                    open={!!imageToDelete}
                    onOpenChange={(open) => {
                        if (!open) setImageToDelete(null);
                    }}
                    title="Удалить изображение?"
                    text="Изображение будет удалено безвозвратно."
                    onConfirm={() => {
                        if (imageToDelete) {
                            void handleDelete([imageToDelete]);
                            setImageToDelete(null);
                        }
                    }}
                />
                {editingId && (
                    <Dialog open={true} onOpenChange={() => setEditingId(null)}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Редактирование изображения</DialogTitle>
                            </DialogHeader>
                            <ImagesEditForm
                                image={images.find((img) => img._id === editingId)!}
                                onSaved={async () => {
                                    await refreshProduct();
                                    setEditingId(null);
                                    clearSelection();
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ImagesModal;