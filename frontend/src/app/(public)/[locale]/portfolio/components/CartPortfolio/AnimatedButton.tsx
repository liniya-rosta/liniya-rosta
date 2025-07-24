import React from "react";
import {BtnArrow} from "@/src/components/ui/btn-arrow";
import {useTranslations} from "next-intl";

export const AnimatedButton = () => {
    const tBtn = useTranslations("Buttons")

        return (
            <div
                className="absolute bottom-1/4 right-8 z-20 transform translate-x-6 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                <BtnArrow
                    className="text-white bg-transparent hover:bg-transparent text-lg font-medium cursor-pointer transform translate-x-8 transition-all duration-500 ease-out delay-100 group-hover:translate-x-0"
                >
                    {tBtn("portfolioBtn")}
                </BtnArrow>
            </div>
        )
    }
;
