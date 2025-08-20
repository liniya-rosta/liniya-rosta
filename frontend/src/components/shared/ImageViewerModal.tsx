import {IMG_BASE} from '@/src/lib/globalConstants';

import React from 'react';
import Image from "next/image";
import {Dialog, DialogContent, DialogTitle} from "@/src/components/ui/dialog";

interface Props {
    open: boolean;
    openChange: () => void,
    alt?: string;
    image: string;
}

const ImageViewerModal: React.FC<Props> = ({open, openChange, alt = "Нет альтернативного названия", image}) => {
    const imageUrl = image.startsWith("blob:") ? image : IMG_BASE + "/" + image;

    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined}>

                <DialogTitle>{alt}</DialogTitle>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={imageUrl}
                    onClick={(e) => e.preventDefault()}
                    className="block max-w-[90vw] max-h-[90vh] w-auto h-auto cursor-default"
                >
                    <Image
                        src={imageUrl}
                        alt={alt || "Изображение портфолио"}
                        width={800}
                        height={600}
                        className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                    />
                </a>
            </DialogContent>
        </Dialog>
    )
}

export default ImageViewerModal;