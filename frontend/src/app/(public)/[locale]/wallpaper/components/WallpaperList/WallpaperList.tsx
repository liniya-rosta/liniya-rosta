'use client'

import React, {useEffect, useState, useCallback} from 'react';
import {ProductResponse} from "@/src/lib/types";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {useProductStore} from "@/store/productsStore";
import CeilingsCard from "@/src/app/(public)/[locale]/ceilings/components/CeilingsCard";
import {CustomContainer} from "@/src/components/shared/CustomContainer";
import {useTranslations} from "next-intl";
import SectionAnimation from "@/src/components/shared/SectionAnimation";
import PaginationButtons from "@/src/components/shared/PaginationButtons";
import {fetchProducts} from "@/actions/products";
import {getPaginationButtons} from "@/src/lib/utils";
import {handleKyError} from "@/src/lib/handleKyError";

interface Props {
    initialData: ProductResponse | null;
    error: string | null;
    limit: string;
    categoryId: string | null;
}

const WallpaperList: React.FC<Props> = ({initialData, error, limit, categoryId}) => {
    const {
        products,
        setProducts,
        fetchProductsLoading,
        setFetchProductsLoading,
    } = useProductStore();

    const [pagination, setPagination] = useState<{
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    } | null>(null);

    const [page, setPage] = useState(1);
    const [fetchError, setFetchError] = useState<string | null>(error);

    const t = useTranslations("WallpaperPage");
    const tProduct = useTranslations("CeilingsPage");
    const tError = useTranslations("Errors");

    let paginationButtons: (string | number)[] | null = null;
    if (pagination) {
        paginationButtons = getPaginationButtons(page, pagination.totalPages);
    }

    const updatedData = useCallback(
        async (initial?: ProductResponse | null, newPage?: number) => {
            try {
                setFetchProductsLoading(true);
                let data: ProductResponse;

                if (initial) {
                    data = initial;
                } else {
                    data = await fetchProducts({
                        limit,
                        page: String(newPage ?? 1),
                        ...(categoryId ? { categoryId } : {}),
                    });
                }

                setProducts(data.items);
                setPagination({
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                });

                setFetchError(null);
            } catch (err) {
                const msg = await handleKyError(err, tError("productsError"));
                setFetchError(msg);
            } finally {
                setFetchProductsLoading(false);
            }
        },
        [limit, categoryId, setFetchProductsLoading, setProducts, tError]
    );

    const handlePageChange = async (newPage: number) => {
        await updatedData(null, newPage);
        setPage(newPage);
    };

    useEffect(() => {
        if (initialData) {
            void updatedData(initialData);
        }
        if (error) {
            setFetchError(error);
        }
    }, [initialData, error, updatedData]);

    if (fetchProductsLoading) return <LoadingFullScreen/>;
    if (fetchError) return <ErrorMsg error={fetchError}/>;

    return (
        <CustomContainer className="mb-10 md:mb-20">
            <SectionAnimation>
                <h2 className="text-18-28-1_2 font-bold text-center mb-12">
                    {t("WallpaperListTitle")}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 ">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <CeilingsCard key={product._id} product={product}/>
                        ))
                    ) : (
                        <p className="text-lg text-center font-medium text-gray-600">
                            {tProduct("noProducts")}
                        </p>
                    )}
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <PaginationButtons
                        page={page}
                        totalPages={pagination.totalPages}
                        paginationButtons={paginationButtons ?? []}
                        onPageChange={handlePageChange}
                    />
                )}
            </SectionAnimation>
        </CustomContainer>
    );
};

export default WallpaperList;