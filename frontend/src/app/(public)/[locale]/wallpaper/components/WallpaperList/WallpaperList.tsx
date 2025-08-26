'use client'

import React, {useEffect} from 'react';
import {useLocale} from "next-intl";
import {Product} from "@/src/lib/types";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {useProductStore} from "@/store/productsStore";
import CeilingsCard from "@/src/app/(public)/[locale]/ceilings/components/CeilingsCard";

interface Props {
    initialData: Product[] | null;
    error: string | null;
}

const WallpaperList: React.FC<Props> = ({initialData, error}) => {
    const locale = useLocale() as "ru" | "ky";
    const {
        products,
        fetchProductsLoading,
        setFetchProductsLoading,
        setProducts,
    } = useProductStore();

    useEffect(() => {
        if (initialData) {
            setProducts(initialData)
        }
        setFetchProductsLoading(false);
    }, []);


    if (fetchProductsLoading) return <LoadingFullScreen/>
    if (error) return <ErrorMsg error={error}/>;

    return (
        <div>
            {products.map(product => (
                <CeilingsCard key={product._id} product={product}/>
            ))}
        </div>
    );
};

export default WallpaperList;