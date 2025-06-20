import Image from "next/image";
import React from "react";
import {cn} from "@/lib/utils";

interface PortfolioImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const CartImage: React.FC<PortfolioImageProps> = ({ src, alt, className }) => (
    <Image
        src={src}
        alt={alt}
        fill
        priority
        className={cn("object-cover transition-transform duration-300 group-hover:scale-105", className)}
        sizes="(max-width: 768px) 100vw, 240px"
    />
);
