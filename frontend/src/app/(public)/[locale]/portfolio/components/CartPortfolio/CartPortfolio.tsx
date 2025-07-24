import React from 'react';
import {cn} from "@/src/lib/utils";
import {CartImage} from "@/src/app/(public)/[locale]/portfolio/components/CartPortfolio/CartImage";
import {GradientOverlay} from "@/src/app/(public)/[locale]/portfolio/components/CartPortfolio/GradientOverlay";
import {AnimatedButton} from "@/src/app/(public)/[locale]/portfolio/components/CartPortfolio/AnimatedButton";

interface Props {
    className?: string;
    imageSrc: string;
    alt?: string;
}

export const CartPortfolio: React.FC<Props> = (
    {className, imageSrc, alt = "image"}) => {
    return (
        <div
            className={cn(
                "relative w-full max-w-[340px] rounded-xl aspect-[4/4] overflow-hidden duration-300 group p-4 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all",
                className
            )}>

            <CartImage alt={alt} src={imageSrc}/>
            <GradientOverlay/>
            <AnimatedButton/>
        </div>
    );
};