import React, {useEffect, useRef, useState} from 'react';
import {Button} from "@/src/components/ui/button";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {useFieldArray, useForm} from "react-hook-form";
import {UpdateProductFormData, updateProductSchema} from "@/src/lib/zodSchemas/admin/productSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateProduct} from "@/actions/superadmin/products";
import {toast} from "react-toastify";
import {handleKyError} from "@/src/lib/handleKyError";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {useRouter} from "next/navigation";
import ProductBasicInfo from "@/src/app/(admin)/admin/products/edit-product/components/ProductBasicInfo";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {ImageObject} from "@/src/lib/types";
import ImagesSection from "@/src/app/(admin)/admin/products/edit-product/components/ImagesSection";
import {fetchCategories} from "@/actions/categories";

interface Props {
    openImagesModal: () => void;
    setIsPreviewOpen: (value: boolean) => void;
    setPreviewImage: (image: ImageObject | null) => void;
}

const ProductEditForm: React.FC<Props> = ({openImagesModal, setPreviewImage, setIsPreviewOpen}) => {
    const router = useRouter();
    const {categories, fetchCategoriesLoading, setCategories, setFetchCategoriesLoading} = useAdminCategoryStore();
    const {updateLoading, setUpdateError, productDetail, paginationProduct} = useAdminProductStore();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: {errors, isDirty}
    } = useForm<UpdateProductFormData>({resolver: zodResolver(updateProductSchema)});
    const {fields, append, remove} = useFieldArray({control, name: 'images'});

    const {
        fields: characteristicFields,
        append: appendCharacteristic,
        remove: removeCharacteristic
    } = useFieldArray({control, name: "characteristics"});

    const [expanded, setExpanded] = useState(false);
    const [replaceAllImages, setReplaceAllImages] = useState(false);
    const [confirmType, setConfirmType] = useState<"replace" | "backToPage" | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setFetchCategoriesLoading(true)
                const cats = await fetchCategories();
                if (cats) setCategories(cats);
            } catch {
                console.error("Ошибка при загрузке категорий");
            } finally {
                setFetchCategoriesLoading(false);
            }
        };
        void loadCategories();
    }, [setCategories]);

    useEffect(() => {

        if (productDetail && categories) {
            reset({
                title: {ru: productDetail.title.ru},
                description: {ru: productDetail.description?.ru},
                seoTitle: {ru: productDetail.seoTitle.ru},
                seoDescription: {ru: productDetail.seoDescription.ru},
                sale: {...productDetail.sale},
                category: productDetail.category?._id,
                coverAlt: productDetail.cover.alt,
                iconAlt: productDetail.icon?.alt,
                characteristics: productDetail.characteristics || [],
            });
        }
    }, [productDetail, reset, categories]);

    useEffect(() => {
        if (confirmType !== null) {
            setShowConfirm(true);
        }
    }, [confirmType]);

    const onCancelReplace = () => {
        setReplaceAllImages(false);
        if (productDetail && categories.length > 0) reset({
            title: {ru: productDetail.title.ru},
            description: {ru: productDetail.description?.ru},
            seoTitle: {ru: productDetail.seoTitle.ru},
            seoDescription: {ru: productDetail.seoDescription.ru},
            sale: {...productDetail.sale},
            category: productDetail.category?._id || "",
            coverAlt: productDetail.cover.alt,
            iconAlt: productDetail.icon?.alt,
            characteristics: productDetail.characteristics || [],
        });
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(`images.${index}.image`, file, {shouldValidate: true});
    };

    const requestConfirmation = (type: "replace" | "backToPage") => {
        setConfirmType(type);
        setShowConfirm(true);
    };

    const confirmActions = () => {
        console.log("requestConfirmation", confirmType);
        if (confirmType === "replace") {
            setReplaceAllImages(true);
            remove();
            append({alt: {ru: ""}, image: null});
        } else if (confirmType === "backToPage") {
            router.push(paginationProduct ? `/admin/blog?page=${paginationProduct.page}` : "/admin/products");
        }
    };

    const [coverPreview, setCoverPreview] = useState<string | null>(productDetail?.cover?.url ? `${API_BASE_URL}/${productDetail.cover.url}` : null);
    const [iconPreview, setIconPreview] = useState<string | null>(productDetail?.icon?.url ? `${API_BASE_URL}/${productDetail.icon.url}` : null);

    const fileInputCoverRef = useRef<HTMLInputElement>(null);
    const fileInputIconRef = useRef<HTMLInputElement>(null);


    if (!productDetail || fetchCategoriesLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <LoaderIcon/>
            </div>
        );
    }

    const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("cover", file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const onIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("icon", file);
        setIconPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data: UpdateProductFormData) => {
        try {
            setUpdateError(null);
            if (replaceAllImages) {
                await updateProduct(productDetail._id, data, "replace");
            } else {
                await updateProduct(productDetail._id, data, "append");
            }
            toast.success('Товар успешно обновлен');
            reset();
            router.push('/admin/products');
        } catch (e) {
            const msg = await handleKyError(e, "Ошибка при обновлении продукта");
            toast.error(msg);
            console.error(msg);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <ProductBasicInfo updateLoading={updateLoading}
                                  errors={errors}
                                  register={register}
                                  categories={categories}
                                  fileInputCoverRef={fileInputCoverRef}
                                  coverPreview={coverPreview}
                                  onCoverChange={onCoverChange}
                                  fileInputIconRef={fileInputIconRef}
                                  iconPreview={iconPreview}
                                  appendCharacteristic={appendCharacteristic}
                                  onIconChange={onIconChange}
                                  characteristicFields={characteristicFields}
                                  removeCharacteristic={removeCharacteristic}
                />

                <ImagesSection
                    fields={fields}
                    append={append}
                    remove={remove}
                    register={register}
                    control={control}
                    errors={errors}
                    updateLoading={updateLoading}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    replaceAllImages={replaceAllImages}
                    onCancelReplace={onCancelReplace}
                    requestConfirmation={requestConfirmation}
                    openImagesModal={openImagesModal}
                    setPreviewImage={setPreviewImage}
                    setIsPreviewOpen={setIsPreviewOpen}
                    handleImageChange={handleImageChange}
                />


                <div className="flex flex-wrap gap-1 md:gap-5">
                    <Button
                        type="submit"
                        className="mt-6 px-6"
                        disabled={updateLoading || !isDirty}
                    >
                        {updateLoading && <LoaderIcon/>}
                        Сохранить изменения
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-6 px-6"
                        disabled={updateLoading}
                        onClick={() => requestConfirmation("backToPage")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
            <ConfirmDialog
                open={showConfirm}
                onOpenChange={(open) => {
                    setShowConfirm(open);
                }}
                title={confirmType === "backToPage" ? "Покинуть страницу?" : "Заменить изображения?"}
                text={confirmType === "replace"
                    ? "При этом действии ВСЕ предыдущие изображения безвозвратно будут заменены. Чтобы просмотреть или редактировать нажмите на кнопку 'Просмотреть старые изображения'"
                    : "Если покинете страницу то введённые данные будут потеряны"
                }
                onConfirm={() => {
                    confirmActions();
                    setShowConfirm(false);
                    setConfirmType(null);
                }}
                loading={updateLoading}
            />
        </>
    );
};

export default ProductEditForm;