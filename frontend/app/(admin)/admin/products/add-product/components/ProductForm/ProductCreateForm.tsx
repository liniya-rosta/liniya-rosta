'use client';

import React, {useEffect} from "react";
import {Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form,} from "@/components/ui/form";
import {CreateProductFormData, createProductSchema,} from "@/lib/zodSchemas/admin/productSchema";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {createProduct} from "@/actions/superadmin/products";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import ErrorMsg from "@/components/ui/ErrorMsg";
import {Category} from "@/lib/types";
import ProductBasicInfo from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductBasicInfo";
import {useCategoryStore} from "@/store/categoriesStore";
import ProductDescription
    from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductDescription";
import ProductCover from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductCover";
import ProductSale from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductSale";
import ProductIcon from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductIcon";
import ProductImagesCharacteristics
    from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductImagesCharacteristics/ProductImagesCharacteristics";
import ProductBtns
    from "@/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductActions/ProductBtns";

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
            title: "",
            category: "",
            description: "",
            cover: null,
            coverAlt: "",
            images: [],
            characteristics: [],
            sale: {
                isOnSale: false,
                label: "",
            },
            icon: null,
            iconAlt: "",
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