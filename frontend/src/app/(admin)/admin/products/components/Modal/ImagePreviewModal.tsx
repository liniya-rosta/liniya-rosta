import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/src/components/ui/dialog";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import Image from "next/image";
import React from "react";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

interface ImagePreviewModalProps {
    image: { url: string; alt: { ru: string, ky?: string } | null } | null;
    onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({image, onClose}) => {
    if (!image) return null;

    const isBlob = image.url.startsWith("blob:");
    const imageUrl = isBlob ? image.url : `${API_BASE_URL}/${image.url}`;

    return (
        <Dialog open={!!image} onOpenChange={onClose}>
            <DialogContent className="max-w-none p-2 sm:p-4">
                <VisuallyHidden>
                    <DialogTitle>Просмотр изображения</DialogTitle>
                </VisuallyHidden>
                <DialogDescription>Полноразмерный просмотр изображения</DialogDescription>

                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={imageUrl}
                    onClick={(e) => e.preventDefault()}
                    className="block"
                >
                    <div className="relative w-full max-w-[80vw] h-auto max-h-[80vh] mx-auto">
                        <Image
                            src={imageUrl}
                            alt={image.alt?.ru || "Изображение"}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{width: "100%", height: "auto", maxHeight: "80vh"}}
                            unoptimized={isBlob}
                        />
                    </div>
                </a>
            </DialogContent>
        </Dialog>
    );
};

export default ImagePreviewModal;