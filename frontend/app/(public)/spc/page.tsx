import React from 'react';
import {Product} from "@/lib/types";
import {fetchCategories} from "@/actions/categories";
import {fetchProducts} from "@/actions/products";
import AdvantagesLaminate from "@/app/(public)/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/app/(public)/spc/components/InfoAboutSpcLaminate";
import SpcLaminatePage from "@/app/(public)/spc/SpcLaminatePage";

const SpcPage = async () => {
    let laminateData: Product[] | null = null;
    let error: string | null = null;
    let categoryName: string = '';

    try {
        const categorySlug = 'spc';
        const categories = await fetchCategories(categorySlug);
        const spcCategory = categories[0];

        categoryName = spcCategory.title;
        laminateData = await fetchProducts(spcCategory._id);
    } catch (e) {
        if (e instanceof Error) {
            error = e.message;
        } else {
            error = 'Ошибка при получении данных';
        }
    }

    return (
        <>
            <InfoAboutSpcLaminate/>
            <div className="container mx-auto px-4">
                <AdvantagesLaminate/>
                <SpcLaminatePage initialData={laminateData} error={error} categoryName={categoryName}/>
            </div>
        </>

    );
};

export default SpcPage;