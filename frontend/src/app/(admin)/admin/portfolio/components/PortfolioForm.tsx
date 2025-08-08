'use client'

import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import React, {useState} from "react";
import {Eye, Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {createPortfolio} from "@/actions/superadmin/portfolios";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {toast} from "react-toastify";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import ImageModal from "@/src/app/(admin)/admin/portfolio/components/ImageModal";
import {z} from "zod";
import {portfolioSchema} from "@/src/lib/zodSchemas/admin/portfolioSchema";
import {PortfolioMutation} from "@/src/lib/types";
import {Textarea} from "@/src/components/ui/textarea";
import {Label} from "@/src/components/ui/label";
import {handleKyError} from "@/src/lib/handleKyError";

const PortfolioForm = () => {
    const {
        register, handleSubmit, setValue, control, trigger, formState: {errors, isDirty}
    } = useForm<z.infer<typeof portfolioSchema>>({
        resolver: zodResolver(portfolioSchema),
        defaultValues: {
            gallery: [],
            cover: null,
            description: {ru: ""},
            coverAlt: {ru: ""},
            seoTitle: {ru: ""},
            seoDescription: {ru: ""},
        },
    });

    const {createLoading, setPortfolioCreateLoading} = useSuperAdminPortfolioStore();
    const {fields, append, remove} = useFieldArray({control, name: "gallery",});
    const router = useRouter();

    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string }>({url: "", alt: ""});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const showImagePreview = (file: File, alt = "") => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({url: localUrl, alt});
        setIsPreviewOpen(true);
    };

    const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setValue("cover", file);
        await trigger("cover");
    };

    const onGalleryChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(`gallery.${index}.image`, file, {shouldValidate: true});
    };

    const handleAltChange = (index: number, value: string) => {
        setValue(`gallery.${index}.alt.ru`, value, {shouldValidate: true});
    };

    const onSubmit = async (data: PortfolioMutation) => {
        try {
            setPortfolioCreateLoading(true)
            await createPortfolio(data)
            router.push("/admin/portfolio");
        } catch (error) {
            const msg = await handleKyError(error, "Неизвестная ошибка при создании портфолио");
            toast.error(msg);
        } finally {
            setPortfolioCreateLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-b-gray-500 py-3 mb-4">
                    <div className="mb-3">
                        <Label className="w-full mb-2">Альтернативное название обложки</Label>
                        <Input
                            className="mb-2"
                            type="text"
                            placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                            disabled={createLoading}
                            {...register("coverAlt.ru")}
                        />
                        {errors.coverAlt && (
                            <FormErrorMessage>{errors.coverAlt.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="mb-3">
                        <Label className="w-full mb-2">Описание</Label>
                        <Textarea
                            className="mb-2"
                            placeholder="Полная отделка квартиры площадью 85 м² в жилом комплексе 'Асанбай Сити'"
                            disabled={createLoading}
                            {...register("description.ru")}
                        />
                        {errors.description && (
                            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="mb-3">
                        <Label className="w-full mb-2">SEO заголовок</Label>
                        <Input
                            className="mb-2"
                            type="text"
                            placeholder="Введите SEO заголовок"
                            disabled={createLoading}
                            {...register("seoTitle.ru")}
                        />
                        {errors.seoTitle?.ru && (
                            <FormErrorMessage>{errors.seoTitle.ru.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="mb-3">
                        <Label className="w-full mb-2">SEO описание</Label>
                        <Textarea
                            className="mb-2"
                            placeholder="Введите SEO описание"
                            disabled={createLoading}
                            {...register("seoDescription.ru")}
                        />
                        {errors.seoDescription?.ru && (
                            <FormErrorMessage>{errors.seoDescription.ru.message}</FormErrorMessage>
                        )}
                    </div>

                    <div>
                        <Label className="mb-2">Обложка</Label>
                        <div className="flex items-center gap-3 mb-2">
                            <Input
                                type="file"
                                placeholder="Обложка"
                                disabled={createLoading}
                                onChange={onCoverChange}
                                accept="image/*"
                                className="w-full max-w-xs"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                disabled={createLoading}
                                onClick={() => {
                                    const file = control._formValues.cover;
                                    if (file instanceof File) {
                                        showImagePreview(file);
                                    }
                                }}
                            >
                                <Eye className="w-4 h-4"/> <span
                                className="hidden md:inline">Посмотреть изображение</span>
                            </Button>
                        </div>
                        {typeof errors.cover?.message === 'string' && (
                            <FormErrorMessage>{errors.cover.message}</FormErrorMessage>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-4xl mb-3">
                    <label className="block mb-4">Галерея:</label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({alt: {ru: ""}, image: null})}
                        disabled={createLoading}
                        className="flex items-center gap-1 mb-4"
                    >
                        <Plus className="w-4 h-4"/>
                        Добавить изображение
                    </Button>
                    {errors.gallery?.message && (
                        <FormErrorMessage>{errors.gallery.message}</FormErrorMessage>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                        {fields.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-6">
                                <Label className="w-full mb-2">Альтернативное название изображения</Label>
                                <Input
                                    type="text"
                                    placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                                    {...register(`gallery.${index}.alt.ru`)}
                                    disabled={createLoading}
                                    onChange={(e) => handleAltChange(index, e.target.value)}
                                    className="mb-3"
                                />
                                {errors.gallery?.[index]?.alt?.ru && (
                                    <FormErrorMessage>
                                        {errors.gallery[index]?.alt?.message}
                                    </FormErrorMessage>
                                )}

                                <Label className="w-full mb-2">Изображение</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={createLoading}
                                    onChange={(e) => onGalleryChange(index, e)}
                                />
                                {errors.gallery?.[index]?.image && (
                                    <FormErrorMessage>
                                        {errors.gallery[index]?.image?.message}
                                    </FormErrorMessage>
                                )}

                                <div className="flex flex-wrap gap-2 items-center justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={createLoading}
                                        onClick={() => {
                                            const file = control._formValues.gallery?.[index]?.image;
                                            if (file instanceof File) {
                                                showImagePreview(file, control._formValues.gallery[index]?.alt);
                                            }
                                        }}
                                    >
                                        <Eye className="w-4 h-4"/>
                                        <span className="hidden md:inline">Посмотреть изображение</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        disabled={createLoading}
                                        onClick={() => remove(index)}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="ml-auto px-8" disabled={!isDirty || createLoading}>
                    {createLoading && <LoaderIcon/>} Создать
                </Button>
            </form>

            <ImageModal
                open={isPreviewOpen}
                openChange={() => setIsPreviewOpen(false)}
                image={previewImage.url}
                alt={previewImage.alt || "Предпросмотр изображения"}
            />
        </>
    )

}
export default PortfolioForm;