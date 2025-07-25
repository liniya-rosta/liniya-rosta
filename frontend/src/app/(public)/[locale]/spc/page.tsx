import React from 'react';
import {Product} from "@/src/lib/types";
import {fetchCategories} from "@/actions/categories";
import {fetchProducts} from "@/actions/products";
import AdvantagesLaminate from "@/src/app/(public)/[locale]/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/src/app/(public)/[locale]/spc/components/InfoAboutSpcLaminate";
import SpcLaminatePage from "@/src/app/(public)/[locale]/spc/SpcLaminatePage";
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";

export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => ({
    title: "SPC ламинат",
    description: "SPC ламинат — влагостойкое и износостойкое покрытие с реалистичной текстурой дерева или камня. Подходит для кухни, ванной и жилых помещений. Обладает шумоизоляцией и устойчив к ультрафиолету.",
    openGraph: {
        title: "SPC ламинат | Линия Роста",
        description: "Узнайте больше о преимуществах SPC ламината: стойкость к влаге, износу и ударам. Профессиональный монтаж под ключ.",
        url: "/spc",
        siteName: "Линия Роста",
        images: [
            {
                url: "/images/services/main-service.JPG",
                width: 1200,
                height: 630,
                alt: "SPC ламинат — монтаж и укладка в Бишкеке",
            },
        ],
        type: "website",
    },
});

const SpcPage = async () => {
    let laminateData: Product[] | null = null;
    let error: string | null = null;
    const tError = await getTranslations('Errors');

    try {
        const categorySlug = 'spc';
        const categories = await fetchCategories(categorySlug);
        const spcCategory = categories[0];

        const laminateResponse = await fetchProducts(spcCategory._id);
        laminateData = laminateResponse.items;
    } catch (e) {
        if (e instanceof Error) {
            error = e.message;
        } else {
            error = tError("SpcError");
        }
    }

    return (
        <>
            <InfoAboutSpcLaminate/>
            <div className="container mx-auto px-4">
                <AdvantagesLaminate/>
                <SpcLaminatePage initialData={laminateData} error={error} />
            </div>
        </>

    );
};

export default SpcPage;