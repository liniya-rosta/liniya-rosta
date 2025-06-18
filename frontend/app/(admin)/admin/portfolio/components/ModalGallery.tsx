import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import React from "react";
import {GalleryItem} from "@/lib/types";
import Image from "next/image";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {API_BASE_URL} from "@/lib/globalConstants";

interface Props {
    open: boolean;
    openChange: () => void,
    gallery: GalleryItem[],
    isOpenModalEdit: (id: string) => void;
    onDeleteGalleryItem: (id: string) => void;
}

const ModalGallery: React.FC<Props> = ({open, openChange, gallery, isOpenModalEdit, onDeleteGalleryItem}) => {
    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined} className="!w-auto !max-w-6xl">
                  <DialogTitle>Галерея</DialogTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-2">

                    {gallery.map((item) => {
                        const imageUrl = API_BASE_URL + "/" + item.image;
                        return (
                            <Card key={item._id} className="w-full h-full flex flex-col">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={imageUrl}
                                    onClick={(e) => e.preventDefault()}
                                    className="block relative w-full h-48 rounded-t overflow-hidden cursor-default"
                                >
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

                                <CardFooter className="flex  justify-between gap-2">
                                    <Button variant="outline" size="sm" onClick={() => isOpenModalEdit(item._id)}>
                                        Редактировать
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => onDeleteGalleryItem(item._id)}>
                                        Удалить
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default ModalGallery;