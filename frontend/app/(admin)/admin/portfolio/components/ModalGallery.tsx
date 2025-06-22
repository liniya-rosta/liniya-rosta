import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, { useState } from "react";
import Image from "next/image";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {API_BASE_URL} from "@/lib/globalConstants";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {Checkbox} from "@/components/ui/checkbox";

interface Props {
    open: boolean;
    openChange: () => void,
    isOpenModalEdit: (id: string) => void;
    onRequestDelete: () => void;
}

const ModalGallery: React.FC<Props> = ({open, openChange, isOpenModalEdit, onRequestDelete}) => {
    const {
        detailItem,
        selectedToDelete,
        setSelectedToDelete
    } = useSuperAdminPortfolioStore();

    const [selectionMode, setSelectionMode] = useState(false);

    const toggleSelect = (id: string) => {
        if (selectedToDelete.includes(id)) {
            setSelectedToDelete(selectedToDelete.filter(_id => _id !== id));
        } else {
            setSelectedToDelete([...selectedToDelete, id]);
        }
    };

    const clearSelection = () => {
        setSelectedToDelete([]);
        setSelectionMode(false);
    };

    return (
        <Dialog open={open} onOpenChange={() => {
            clearSelection();
            openChange();
        }}>
            <DialogContent aria-describedby={undefined} className="!w-auto !max-w-6xl">
                <DialogHeader className="flex justify-between items-center gap-4">
                    <DialogTitle>Галерея</DialogTitle>
                    <div className="flex gap-2">
                        {selectionMode ? (
                            <>
                                <Button
                                    variant="destructive"
                                    disabled={selectedToDelete.length === 0}
                                    onClick={onRequestDelete}
                                >
                                    Удалить выбранные ({selectedToDelete.length})
                                </Button>
                                <Button variant="outline" onClick={clearSelection}>
                                    Отменить выбор
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setSelectionMode(true)}>
                                Выбрать элементы
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-2">
                    {detailItem?.gallery.map((item) => {
                        const imageUrl = API_BASE_URL + "/" + item.image;
                        const isSelected = selectedToDelete.includes(item._id);

                        return (
                            <Card
                                key={item._id}
                                className={`w-full h-full flex flex-col cursor-pointer transition 
                                    ${isSelected ? "ring-2 ring-primary" : ""}`}
                                onClick={() => {
                                    if (selectionMode) toggleSelect(item._id);
                                }}
                            >
                                <a
                                    href={imageUrl}
                                    onClick={(e) => e.preventDefault()}
                                    className="block relative w-full h-48 rounded-t overflow-hidden"
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
                                        alt={item.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    />
                                </a>

                                <CardContent className="flex-1">
                                    <div className="text-sm text-gray-700 line-clamp-2">{item.alt}</div>
                                </CardContent>

                                <CardFooter className="flex justify-between gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => isOpenModalEdit(item._id)}
                                        disabled={selectionMode}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedToDelete([item._id]);
                                            onRequestDelete()
                                        }}
                                        disabled={selectionMode}
                                    >
                                        Удалить
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default ModalGallery;