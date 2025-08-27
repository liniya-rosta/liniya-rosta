'use client'

import React, {useEffect} from 'react';
import {Product} from "@/src/lib/types";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {useProductStore} from "@/store/productsStore";
import CeilingsCard from "@/src/app/(public)/[locale]/ceilings/components/CeilingsCard";
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import {useTranslations} from "next-intl";
import SectionAnimation from "@/src/components/shared/SectionAnimation";

interface Props {
    initialData: Product[] | null;
    error: string | null;
}

const WallpaperList: React.FC<Props> = ({initialData, error}) => {
    const {
        products,
        fetchProductsLoading,
        setFetchProductsLoading,
        setProducts,
    } = useProductStore();

    const t = useTranslations("WallpaperPage");
    const tProduct = useTranslations("CeilingsPage");

    useEffect(() => {
        if (initialData) {
            setProducts(initialData)
        }
        setFetchProductsLoading(false);
    }, []);


    if (fetchProductsLoading) return <LoadingFullScreen/>
    if (error) return <ErrorMsg error={error}/>;

    return (
        <CustomContainer className="mb-10 md:mb-20">
            <SectionAnimation>
                <h2 className="text-18-28-1_2 font-bold text-center mb-12">{t("WallpaperListTitle")}</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 ">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <CeilingsCard key={product._id} product={product}/>
                        ))
                    ) : (
                        <p className="text-lg text-center font-medium text-gray-600">{tProduct("noProducts")}</p>
                    )}
                </div>
            </SectionAnimation>
        </CustomContainer>
    );
};

export default WallpaperList;