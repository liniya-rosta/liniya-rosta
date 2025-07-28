import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/src/components/ui/dialog";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import Image from "next/image";
import React from "react";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

interface ImagePreviewModalProps {
    image: { url: string; alt: string } | null;
    onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({image, onClose}) => {
    if (!image) return null;

    const isBlob = image.url.startsWith("blob:");
    const imageUrl = isBlob ? image.url : `${API_BASE_URL}/${image.url}`;

    return (
        <Dialog open={!!image} onOpenChange={onClose}>
            <DialogContent className="w-auto max-w-[90vw] p-4">
                <VisuallyHidden>
                    <DialogTitle>Просмотр изображения</DialogTitle>
                </VisuallyHidden>
                <DialogDescription>Полноразмерный просмотр изображения</DialogDescription>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={imageUrl}
                    onClick={(e) => e.preventDefault()}
                    className="block max-w-[90vw] max-h-[90vh] w-auto h-auto cursor-default py-5"
                >
                    <Image
                        src={imageUrl}
                        alt={image.alt || "Изображение"}
                        width={800}
                        height={600}
                        className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                    />
                </a>
            </DialogContent>
        </Dialog>
    );
};

export default ImagePreviewModal;