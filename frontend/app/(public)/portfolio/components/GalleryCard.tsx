import Image from "next/image";
import React from "react";
import {cn} from "@/lib/utils";

interface Props {
    id: string;
    imageUrl: string;
    handleOpen: (index: number) => void;
    alt: string;
    index: number;
    className?: string;
    classNameImage?: string;
}

const GalleryCard: React.FC<Props> = (
    {id, alt, imageUrl, handleOpen, index, className, classNameImage}
) => {
    return (
        <a
            key={id}
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                e.preventDefault();
                handleOpen(index);
            }}
            className={cn("block relative",className)}
        >
            <Image
                src={imageUrl}
                alt={alt}
                fill
                priority
                className={cn(classNameImage)}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
        </a>
    )
}

export default GalleryCard;