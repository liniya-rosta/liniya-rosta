import React from 'react';
import {cn} from "@/src/lib/utils";
import {CartImage} from "@/src/app/(public)/[locale]/portfolio/components/CartPortfolio/CartImage";
import {Images} from "lucide-react";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {BtnArrow} from "@/src/components/ui/btn-arrow";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {CardTitle} from "@/src/components/ui/card";

interface Props {
    className?: string;
    imageSrc: string;
    alt?: string;
    buttonLink?:string | null;
    title: { ru: string; ky: string };
}

export const CartPortfolio: React.FC<Props> = ({className, imageSrc, alt = "image", title, buttonLink}) => {
    const {paginationPortfolio} = usePortfolioStore();
    const tBtn = useTranslations("Buttons");
    const locale = useLocale() as "ru" | "ky";

    return (
        <div
            className={cn(
                "relative w-full rounded-xl aspect-[3/4] overflow-hidden group border border-gray-200 dark:border-white/10 shadow-md transition-all duration-300",
                className
            )}
        >
            <CartImage alt={alt} src={imageSrc} />
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute top-5 right-7 z-20 flex items-center gap-2">
                {paginationPortfolio?.total !== undefined && (
                    <span className="text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                        {paginationPortfolio.total} фото
                    </span>
                )}

                <div className="h-10 w-10 border border-white rounded-xl flex justify-center items-center bg-black/60">
                    <Images className="text-white" />
                </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 ">
                <CardTitle className="text-white">{title[locale]}</CardTitle>
                <BtnArrow className="text-white !p-0" variant="link">
                    {buttonLink ? (
                        <Link href={`/portfolio/${buttonLink}`}>
                            {tBtn("portfolioBtn")}
                        </Link>
                    ) : (
                        <span className="group-hover:underline"> {tBtn("portfolioBtn")}</span>
                    )}
                </BtnArrow>
            </div>
        </div>
    );
};