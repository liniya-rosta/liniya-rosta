import React from 'react';
import {cn} from "@/lib/utils";
import {CartImage} from "@/app/(public)/portfolio/components/CartPortfolio/CartImage";
import {GradientOverlay} from "@/app/(public)/portfolio/components/CartPortfolio/GradientOverlay";
import {AnimatedButton} from "@/app/(public)/portfolio/components/CartPortfolio/AnimatedButton";

interface Props {
    className?: string;
    imageSrc: string;
    textBtn: string;
    alt?: string;
}

export const CartPortfolio: React.FC<Props> = (
    {className, imageSrc, textBtn, alt = "image"}) => {
    return (
        <div
            className={cn(
                "relative w-full max-w-[340px] aspect-[3/4] overflow-hidden duration-300 group p-4 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all",
                className
            )}>

            <CartImage alt={alt} src={imageSrc}/>
            <GradientOverlay/>
            <AnimatedButton text={textBtn}/>
        </div>
    );
};