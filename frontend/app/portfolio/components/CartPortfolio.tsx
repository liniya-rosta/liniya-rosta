import React from 'react';
import {cn} from "@/lib/utils";
import Image from "next/image";
import {DarkBtn} from "@/components/ui/dark-btn";
import Link from "next/link";

interface Props {
    className?: string;
    imageSrc:  string;
    link:  string;
    alt?: string;
}

export const CartPortfolio: React.FC<Props> = (
    { className, imageSrc, link, alt="image" }) => {
    return (
        <Link
            href={link}
            className={cn(
                "relative w-full max-w-[240px] aspect-[3/4] overflow-hidden rounded-xl shadow-lg group",
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
            <DarkBtn
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
            >
                Подробнее
            </DarkBtn>
        </Link>
    );
};