import React from 'react';
import ClientActions from "@/src/app/(public)/[locale]/spc/components/ClientActions";
import {getTranslations} from "next-intl/server";

const InfoAboutSpcLaminate = async () => {

    const tSpc = await getTranslations('SpcPage');

    return (
            <div className="relative w-full h-[450px] flex items-center justify-center text-white mt-[-32px] mb-[70px] sm:mb-[48px]">
                <div className="absolute inset-0 bg-[url('/images/spc-laminate.png')] bg-cover bg-center
                before:absolute before:inset-0 before:bg-black/65 before:content-[''] z-0" />
                <div className="relative z-10 px-4 text-center max-w-[90%]">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">{tSpc('title')}</h2>
                    <p className="sm:text-base max-w-[600px] mb-5 text-sm">
                        {tSpc('description')}
                    </p>
                    <ClientActions />
                </div>
            </div>
    );
};

export default InfoAboutSpcLaminate;
