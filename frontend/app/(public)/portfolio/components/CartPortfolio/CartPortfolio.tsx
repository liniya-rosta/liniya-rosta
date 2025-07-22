import React from 'react';
import {cn} from "@/lib/utils";
import {CartImage} from "@/app/(public)/portfolio/components/CartPortfolio/CartImage";
import {Images} from "lucide-react";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {BtnArrow} from "@/components/ui/btn-arrow";
import Link from "next/link";

interface Props {
    className?: string;
    imageSrc: string;
    alt?: string;
    buttonLink?:string | null;
}

export const CartPortfolio: React.FC<Props> = ({className, imageSrc, alt = "image", buttonLink=null}) => {
    const {paginationPortfolio} = usePortfolioStore();

    return (
        <div
            className={cn(
                "relative w-full rounded-xl aspect-[3/4] overflow-hidden group border border-gray-200 dark:border-white/10 shadow-md transition-all duration-300",
                className
            )}
        >
            <CartImage alt={alt} src={imageSrc} />
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute top-5 right-7 z-11 h-10 w-10 border border-white rounded-xl flex justify-center items-center bg-black/60">
                <Images className="text-white"/>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 ">
                {paginationPortfolio?.total !== undefined && (
                    <div>
                        <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded">{paginationPortfolio.total} фото</span>
                    </div>

                )}
                <BtnArrow className="text-white" variant="link">
                    {buttonLink ? (
                        <Link href={`/portfolio/${buttonLink}`}>
                            Открыть галерею
                        </Link>
                    ) : (
                        <span className="group-hover:underline">Открыть галерею</span>
                    )}
                </BtnArrow>
            </div>
        </div>

    );
};
