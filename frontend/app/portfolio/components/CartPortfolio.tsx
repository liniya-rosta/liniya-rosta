import React from 'react';
import {cn} from "@/lib/utils";
import Image from "next/image";
import {BtnArrow} from "@/components/ui/btn-arrow";

interface Props {
    className?: string;
    imageSrc: string;
    textBtn:  string;
    alt?: string;
}

export const CartPortfolio: React.FC<Props> = (
    {className, imageSrc, textBtn, alt = "image"}) => {
    return (
        <div
            className={cn(
                "relative w-full max-w-[440px] aspect-[3/4] overflow-hidden duration-300 group ",
                className
            )}>
            <Image
                src={imageSrc}
                alt={alt}
                fill
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 240px"
            />
            <div className="absolute top-0 right-0 h-full w-0 group-hover:w-full transition-all duration-500 z-10"
                 style={{
                     background: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)'
                 }}
            />
            <div
                className="absolute bottom-3/12 right-8 z-20 transform translate-x-6 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
            >
                <BtnArrow className="text-white bg-transparent hover:bg-transparent text-lg font-medium" >{textBtn}</BtnArrow>
            </div>

        </div>
    );
};