'use client';

import React, {useEffect} from "react";
import {Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form,} from "@/src/components/ui/form";
import {CreateProductFormData, createProductSchema,} from "@/src/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {createProduct} from "@/actions/superadmin/products";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import {cn} from "@/src/lib/utils";
import {useRouter} from "next/navigation";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {Category} from "@/src/lib/types";
import ProductBasicInfo from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductBasicInfo";
import {useCategoryStore} from "@/store/categoriesStore";
import ProductDescription
    from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductDescription";
import ProductCover from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductCover";
import ProductSale from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductSale";
import ProductIcon from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductIcon";
import ProductImagesCharacteristics
    from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductImagesCharacteristics/ProductImagesCharacteristics";
import ProductBtns
    from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductActions/ProductBtns";
import ProductSEO from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductSEO";

interface Props {
    initialCategories: Category[];
    initialCategoriesError: string | null;
}

const ProductCreateForm: React.FC<Props> = ({initialCategories, initialCategoriesError}) => {
    const {
        createLoading,
        createError,
        setCreateLoading,
        setCreateError,
    } = useAdminProductStore();
    const {setCategories, fetchCategoriesError, setFetchCategoriesError} = useCategoryStore();

    useEffect(() => {
        if (initialCategories.length > 0) setCategories(initialCategories);
        if (initialCategoriesError) setFetchCategoriesError(initialCategoriesError);
    }, [initialCategories, setCategories, initialCategoriesError, setFetchCategoriesError]);

    const router = useRouter();
    const form = useForm<CreateProductFormData>({
        resolver: zodResolver(createProductSchema) as Resolver<CreateProductFormData>,
        mode: "onChange",
        defaultValues: {
            title: {ru: ""},
            category: "",
            description: {ru: ""},
            seoTitle: "",
            seoDescription: "",
            cover: null,
            coverAlt: {ru: ""},
            images: [],
            characteristics: [],
            sale: {
                isOnSale: false,
                label: {ru: ""},
            },
            icon: null,
            iconAlt: {ru: ""},
        },
    });

    const overallError = fetchCategoriesError || createError;

    const onSubmit = async (data: CreateProductFormData) => {
        data.images = data.images.filter(image => image.url instanceof File);
        try {
            setCreateLoading(true);
            setCreateError(null);
            await createProduct(data);
            toast.success("Продукт успешно создан");
            router.push("/admin/products");
        } catch (e) {
            if (e instanceof AxiosError) {
                setCreateError(e.response?.data.error);
                toast.error(e.response?.data.error);
            } else {
                toast.error('Неизвестная ошибка');
            }
            console.error(e);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-6", createLoading && "opacity-50 pointer-events-none")}
            >
                <ProductBasicInfo form={form}/>

                <ProductSEO form={form}/>

                <ProductDescription form={form}/>

                <ProductCover form={form}/>

                <ProductSale form={form}/>

                <ProductIcon form={form}/>

                <ProductImagesCharacteristics form={form}/>

                {(overallError) && <ErrorMsg error={overallError}/>}

                <ProductBtns onConfirm={form.handleSubmit(onSubmit)}/>
            </form>
        </Form>
    );
};

export default ProductCreateForm;