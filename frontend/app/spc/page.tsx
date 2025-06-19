import React from 'react';
import SpcLaminatePage from "@/app/spc/SpcLaminatePage";
import {Product} from "@/lib/types";
import AdvantagesLaminate from "@/app/spc/components/AdvantagesLaminate";
import InfoAboutSpcLaminate from "@/app/spc/components/InfoAboutSpcLaminate";
import {fetchCategories} from "@/actions/categories";
import {fetchProducts} from "@/actions/products";

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
        <div className="container mx-auto px-4">
            <InfoAboutSpcLaminate/>

            <AdvantagesLaminate/>

            <SpcLaminatePage initialData={laminateData} error={error} categoryName={categoryName}/>
        </div>
    );
};

export default SpcPage;