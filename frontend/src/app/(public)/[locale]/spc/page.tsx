import React from 'react';
import {Product} from "@/src/lib/types";
import {fetchCategories} from "@/actions/categories";
import {fetchProducts} from "@/actions/products";
import AdvantagesLaminate from "@/src/app/(public)/[locale]/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/src/app/(public)/[locale]/spc/components/InfoAboutSpcLaminate";
import SpcLaminatePage from "@/src/app/(public)/[locale]/spc/SpcLaminatePage";
import {getTranslations} from "next-intl/server";
import {Metadata} from "next";
import {CustomContainer} from '@/src/components/shared/CustomContainer';
import {handleKyError} from "@/src/lib/handleKyError";

export const revalidate = 3600;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations('SpcPage');
    const tHeader = await getTranslations('Header');

    return {
        title: tHeader('headerLinks.spcLaminate'),
        description: t('descriptionSeo'),
        openGraph: {
            title: `${tHeader('headerLinks.spcLaminate')}`,
            description: t('ogDescription'),
            url: '/spc',
            siteName: 'Линия Роста',
            images: [
                {
                    url: '/images/services/main-service.JPG',
                    width: 1200,
                    height: 630,
                    alt: t('ogImageAlt'),
                },
            ],
            type: 'website',
        },
    };
};

const SpcPage = async () => {
    let laminateData: Product[] | null = null;
    let error: string | null = null;
    const tError = await getTranslations('Errors');

    try {
        const categorySlug = 'spc';
        const categories = await fetchCategories(categorySlug);
        const spcCategory = categories[0];

        const laminateResponse = await fetchProducts({categoryId: spcCategory._id});
        laminateData = laminateResponse.items;
    } catch (e) {
        error = await handleKyError(e, tError('SpcError'));
    }

    return (
        <>
            <InfoAboutSpcLaminate/>
            <CustomContainer>
                <AdvantagesLaminate/>
                <SpcLaminatePage initialData={laminateData} error={error}/>
            </CustomContainer>
        </>

    );
};

export default SpcPage;