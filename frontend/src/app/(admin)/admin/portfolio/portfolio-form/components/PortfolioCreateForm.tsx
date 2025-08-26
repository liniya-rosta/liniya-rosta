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
import {z} from "zod";
import {portfolioSchema} from "@/src/lib/zodSchemas/admin/portfolioSchema";
import {PortfolioMutation} from "@/src/lib/types";
import {Textarea} from "@/src/components/ui/textarea";
import {Label} from "@/src/components/ui/label";
import {handleKyError} from "@/src/lib/handleKyError";
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";

const PortfolioCreateForm = () => {
    const {
        register, handleSubmit, setValue, control, trigger, formState: {errors, isDirty}
    } = useForm<z.infer<typeof portfolioSchema>>({
        resolver: zodResolver(portfolioSchema),
        defaultValues: {},
    });

    const {createLoading, paginationPortfolio, setPortfolioCreateLoading} = useSuperAdminPortfolioStore();
    const {fields, append, remove} = useFieldArray({control, name: "gallery",});
    const router = useRouter();

    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string }>({url: "", alt: ""});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
        setValue(`gallery.${index}.alt`, value, {shouldValidate: true});
    };

    const onSubmit = async (data: PortfolioMutation) => {
        try {
            setPortfolioCreateLoading(true)
            await createPortfolio(data)
            router.push("/admin/portfolio");
            toast.success("Успешно создано портфолио")
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
                <div className="border-b border-b-gray-500 py-3 space-y-3 mb-4">
                    <div className="space-y-1">
                        <Label className="w-full">Заголовок</Label>
                        <Input
                            type="text"
                            placeholder="Введите заголовок"
                            disabled={createLoading}
                            {...register("title")}
                        />
                        {errors.title && (
                            <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="w-full">SEO заголовок</Label>
                        <Input
                            type="text"
                            placeholder="Заголовок, который видят в поиске в интернете"
                            disabled={createLoading}
                            {...register("seoTitle")}
                        />
                        {errors.seoTitle && (
                            <FormErrorMessage>{errors.seoTitle.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="w-full">Описание</Label>
                        <Textarea
                            placeholder="Полная отделка квартиры площадью 85 м² в жилом комплексе 'Асанбай Сити'"
                            disabled={createLoading}
                            {...register("description")}
                        />
                        {errors.description && (
                            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="w-full">SEO описание</Label>
                        <Textarea
                            placeholder="Краткий текст, который отображается в результатах поиска и служит для привлечения внимания пользователя, побуждая его перейти на ваш сайт."
                            disabled={createLoading}
                            {...register("seoDescription")}
                        />
                        {errors.seoDescription && (
                            <FormErrorMessage>{errors.seoDescription.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="w-full">Альтернативное название обложки</Label>
                        <Input
                            type="text"
                            placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                            disabled={createLoading}
                            {...register("coverAlt")}
                        />
                        {errors.coverAlt && (
                            <FormErrorMessage>{errors.coverAlt.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Обложка</Label>
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
                   <div className="flex items-center gap-3 flex-wrap">
                       <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => append({alt: "", image: null})}
                           disabled={createLoading}
                           className="flex items-center gap-1"
                       >
                           <Plus className="w-4 h-4"/>
                           Добавить изображение
                       </Button>
                       {errors.gallery?.message && (
                           <FormErrorMessage>{errors.gallery.message}</FormErrorMessage>
                       )}

                       <Button
                           type="button"
                           variant="outline"
                           onClick={() => setExpanded(prev => !prev)}
                           className="text-sm"
                           disabled={createLoading || fields.length < 5}
                       >
                           {expanded ? 'Свернуть' : 'Развернуть все'}
                       </Button>
                   </div>

                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${
                            expanded ? 'max-h-none overflow-visible' : 'max-h-[500px] overflow-y-auto'
                        }`}
                    >
                        {fields.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-6">
                                <Label className="w-full mb-2">Альтернативное название изображения</Label>
                                <Input
                                    type="text"
                                    placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                                    {...register(`gallery.${index}.alt`)}
                                    disabled={createLoading}
                                    onChange={(e) => handleAltChange(index, e.target.value)}
                                    className="mb-3"
                                />
                                {errors.gallery?.[index]?.alt && (
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

                <div className="flex flex-wrap gap-4 mt-6">
                    <Button type="submit" className="px-8" disabled={!isDirty || createLoading}>
                        {createLoading && <LoaderIcon/>} Создать
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setShowConfirm(true);
                        }}
                    >
                        Отмена
                    </Button>
                </div>

            </form>

            <ImageViewerModal
                open={isPreviewOpen}
                openChange={() => setIsPreviewOpen(false)}
                image={previewImage.url}
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Покинуть страницу?"
                text="Если уйти, изменения не сохранятся."
                onConfirm={() => {
                    setShowConfirm(false);
                    router.push(
                        paginationPortfolio ? `/admin/portfolio?page${paginationPortfolio?.page} ` : "/admin/portfolio"
                    );
                }}
                loading={createLoading}
            />
        </>
    )

}
export default PortfolioCreateForm;