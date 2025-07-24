import React from 'react';
import {Product} from "@/src/lib/types";
import {fetchCategories} from "@/actions/categories";
import {fetchProducts} from "@/actions/products";
import AdvantagesLaminate from "@/src/app/(public)/[locale]/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/src/app/(public)/[locale]/spc/components/InfoAboutSpcLaminate";
import SpcLaminatePage from "@/src/app/(public)/[locale]/spc/SpcLaminatePage";
import {getTranslations} from "next-intl/server";

const SpcPage = async () => {
    let laminateData: Product[] | null = null;
    let error: string | null = null;
    const tError = await getTranslations('Errors');

    try {
        const categorySlug = 'spc';
        const categories = await fetchCategories(categorySlug);
        const spcCategory = categories[0];

        laminateData = await fetchProducts(spcCategory._id);
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