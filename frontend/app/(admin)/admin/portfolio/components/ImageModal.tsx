import {Dialog, DialogContent} from "@/components/ui/dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import React from "react";

interface Props {
    open: boolean;
    openChange: () => void,
    alt: string;
    image: string;
}

const ImageModal: React.FC<Props> = ({open, openChange, alt, image}) => {
    const imageUrl = image.startsWith("blob:") ? image : API_BASE_URL + "/" + image;

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

export default ImageModal;