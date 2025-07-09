import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import React from "react";
import {API_BASE_URL} from "@/lib/globalConstants";
import LoaderIcon from "@/components/ui/LoaderIcon";

interface GalleryItem {
    image: string;
    alt?: string;
    _id?: string;
}

interface Props {
    open: boolean;
    openChange: () => void;
    items: GalleryItem[];
    selectedKeys: string[];
    setSelectedKeys: (keys: string[]) => void;
    selectionMode: boolean;
    setSelectionMode: (enabled: boolean) => void;
    onEdit?: (key: string) => void;
    onDelete: (keys: string[]) => void;
    keyBy?: "id" | "image";
    deleteLoading?: boolean;
}

const ModalGallery: React.FC<Props> = ({
                                           open,
                                           openChange,
                                           items,
                                           selectedKeys,
                                           setSelectedKeys,
                                           selectionMode,
                                           setSelectionMode,
                                           onEdit,
                                           onDelete,
                                           keyBy = "id",
                                           deleteLoading=false
                                                }) => {


    const getKey = (item: GalleryItem) => (keyBy === "id" ? item._id : item.image);

    const toggleSelect = (key: string) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
            setSelectedKeys([...selectedKeys, key]);
        }
    };

    const clearSelection = () => {
        setSelectedKeys([]);
        setSelectionMode(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                clearSelection();
                openChange();
            }}
        >
            <DialogContent className="!w-auto !max-w-6xl" aria-describedby={undefined}>
                <DialogHeader className="flex justify-between items-center gap-4">
                    <DialogTitle>Галерея</DialogTitle>
                    <div className="flex gap-2">
                        {selectionMode ? (
                            <>
                                <Button
                                    variant="destructive"
                                    disabled={selectedKeys.length === 0 || deleteLoading}
                                    onClick={() => onDelete(selectedKeys)}
                                >
                                    Удалить выбранные ({selectedKeys.length})
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={deleteLoading}
                                    onClick={clearSelection}>
                                    Отменить выбор
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setSelectionMode(true)}
                                disabled={deleteLoading}
                            >Выбрать элементы
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                {items.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-${items.length > 1 ? "2" : "1"} gap-6 max-h-[70vh] overflow-y-auto p-2`}>
                        {items.map((item) => {
                            const key = getKey(item);
                            if (!key) return null;

                            const imageUrl = API_BASE_URL ? `${API_BASE_URL}/${item.image}` : item.image;
                            const isSelected = selectedKeys.includes(key);

                            return (
                                <Card
                                    key={key}
                                    className={`w-full h-full flex flex-col transition ${
                                        selectionMode ? "cursor-pointer" : ""
                                    } ${isSelected ? "ring-2 ring-primary" : ""}`}
                                    onClick={() => selectionMode && toggleSelect(key)}
                                >
                                    <div className="relative w-full h-48 rounded-t overflow-hidden">
                                        {selectionMode && (
                                            <div className="absolute z-10 top-2 left-2">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleSelect(key)}
                                                />
                                            </div>
                                        )}
                                        <Image
                                            src={imageUrl}
                                            alt={item.alt || ""}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        />
                                    </div>

                                    <CardContent className="flex-1">
                                        <div className="text-sm text-gray-700 line-clamp-2">
                                            {item.alt}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-between gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit?.(key)}
                                            disabled={selectionMode || deleteLoading}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDelete([key])}
                                            disabled={selectionMode || deleteLoading}
                                        >
                                            {deleteLoading && <LoaderIcon/>}
                                            Удалить
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p>Нет изображений в галерее</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ModalGallery;
