"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/lib/globalConstants";
import {
    deleteProductImage,
    updateProductImage,
} from "@/actions/superadmin/products";
import { useAdminProductStore } from "@/store/superadmin/superadminProductsStore";
import {fetchProductById} from "@/actions/products";
import {isAxiosError} from "axios";

interface Props {
    open: boolean;
    onClose: () => void;
}

const ImagesModal: React.FC<Props> = ({ open, onClose }) => {
    const { productDetail, setProductDetail,setProducts, products , setUpdateError} = useAdminProductStore();

    const images = productDetail?.images ?? [];
    const productId = productDetail?._id ?? "";

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newAlt, setNewAlt] = useState("");

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
            setNewAlt(img.alt || "");
        }
    };

    const handleUpdateAlt = async () => {
        if (!editingId) return;
        try {
            await updateProductImage(editingId, undefined, newAlt);
            toast.success("Alt обновлён");
            await refreshProduct();
            setEditingId(null);
            setSelectedIds([]);
        } catch (e) {
            toast.error("Ошибка при обновлении alt");
            console.error(e);
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
        try {
            const product = await fetchProductById(productId);
            setProductDetail(product);
            setProducts(
                products.map((p) =>
                    p._id === product._id ? product : p
                )
            );
        } catch (e) {
            if (isAxiosError(e)){
                setUpdateError(e.response?.data.error);
                toast.error(e.response?.data.error);
            } else {
                toast.error("Ошибка при обновлении изображений");
            }
            console.error(e);
        }
    }, [productId, products, setProductDetail ,setProducts, setUpdateError]);

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
                    setProductDetail(null);
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
                            const imageUrl = `${API_BASE_URL}/${item.url}`;
                            const isSelected = selectedIds.includes(item._id);

                            return (
                                <Card
                                    key={item._id}
                                    className={`w-full h-full flex flex-col transition
                                        ${selectionMode ? "cursor-pointer" : ""}
                                        ${isSelected ? "ring-2 ring-primary" : ""}`}
                                    onClick={() => {
                                        if (selectionMode) toggleSelect(item._id);
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
                                                    onCheckedChange={() => toggleSelect(item._id)}
                                                />
                                            </div>
                                        )}
                                        <Image
                                            src={imageUrl}
                                            alt={item.alt || "Изображение"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        />
                                    </a>

                                    <CardContent className="flex-1">
                                        <div className="text-sm text-gray-700 line-clamp-2">{item.alt || "—"}</div>
                                    </CardContent>

                                    <CardFooter className="flex justify-between gap-2 px-3 pb-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditClick(item._id)}
                                            disabled={selectionMode}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete([item._id])}
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
            </DialogContent>

            {editingId && (
                <Dialog open={true} onOpenChange={() => setEditingId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Редактировать alt</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input
                                value={newAlt}
                                onChange={(e) => setNewAlt(e.target.value)}
                                placeholder="Введите alt текст"
                            />
                            <Button onClick={handleUpdateAlt}>Сохранить</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
};

export default ImagesModal;