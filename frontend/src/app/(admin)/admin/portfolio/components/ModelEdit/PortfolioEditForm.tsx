'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {PortfolioEditValues} from "@/lib/types";
import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import React, {useEffect, useState} from "react";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {editPortfolioItem} from "@/actions/superadmin/portfolios";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import LoaderIcon from "@/src/components/ui/LoaderIcon";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import {Eye} from "lucide-react";
import ImageModal from "@/src/app/(admin)/admin/portfolio/components/ImageModal";
import {Label} from "@/src/components/ui/label";
import {portfolioItemSchema} from "@/lib/zodSchemas/portfolioSchema";

interface Props {
    onSaved: () => void;
    updatePaginationAndData: () => void;
}

const PortfolioEditForm: React.FC<Props> = ({onSaved, updatePaginationAndData}) => {
    const {register, handleSubmit, setValue, reset, control, formState: {errors, isDirty}} = useForm({
        resolver: zodResolver(portfolioItemSchema),
    });

    const {
        detailItem,
        editLoading,
        setPortfolioEditLoading,
    } = useSuperAdminPortfolioStore();

    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string }>({url: "", alt: ""});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const showImagePreview = (file: File, alt = "") => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({url: localUrl, alt});
        setIsPreviewOpen(true);
    };

    useEffect(() => {
        if (detailItem) {
            reset({
                description: detailItem.description,
                coverAlt: detailItem.coverAlt,
            });
        }
    }, [detailItem, reset]);


    const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("cover", file, {shouldDirty: true});
    };

    const onSubmit = async (data: PortfolioEditValues) => {
        if (!detailItem) return;

        try {
            setPortfolioEditLoading(true);
            await editPortfolioItem({item: data, id: detailItem._id});

            await updatePaginationAndData();
            onSaved()
            toast.success("Вы успешно обновили портфолио");
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при редактировании портфолио";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setPortfolioEditLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-b-gray-500 py-3 mb-4">
                    <div className="mb-4">
                        <Label htmlFor="description" className="mb-2">Описание</Label>
                        <Input
                            className="mb-2"
                            type="text"
                            id="description"
                            disabled={editLoading}
                            {...register("description")}
                        />
                        {errors.description && (
                            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="coverAlt" className="mb-2">Альтернативное название обложки</Label>
                        <Input
                            className="mb-2"
                            type="text"
                            id="coverAlt"
                            disabled={editLoading}
                            placeholder="Натяжной потолок с LED-подсветкой в гостиной"
                            {...register("coverAlt")}
                        />
                        {errors.coverAlt && (
                            <FormErrorMessage>{errors.coverAlt.message}</FormErrorMessage>
                        )}
                    </div>

                    <div className="mb-3">
                        <Label className="mb-2">Обложка</Label>
                        <div className="mb-4 flex items-center gap-3">

                            <Input
                                className="w-full max-w-xs"
                                type="file"
                                placeholder="Обложка"
                                disabled={editLoading}
                                onChange={onCoverChange}
                                accept="image/*"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                disabled={editLoading}
                                size="sm"
                                onClick={() => {
                                    const file = control._formValues.cover;
                                    if (file instanceof File) {
                                        showImagePreview(file);
                                    }
                                }}
                            >
                                <Eye className="w-4 h-4" /> Посмотреть
                            </Button>
                        </div>
                        {errors.cover && (
                            <FormErrorMessage>{errors.cover.message}</FormErrorMessage>
                        )}
                    </div>

                    {detailItem && (
                        <>
                            <p className="mb-1">Предыдущее изображение</p>
                            <div className="relative w-[200px] h-[200px]">
                                <Image
                                    src={API_BASE_URL + "/" + detailItem.cover}
                                    alt={detailItem.coverAlt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 200px"
                                    className="object-contain rounded"
                                />
                            </div>
                        </>

                    )}
                </div>

                <Tooltip>
                    <div className="flex justify-end mt-4">
                    <TooltipTrigger asChild>

                            <Button type="submit" disabled={!isDirty || editLoading}>
                                {editLoading && <LoaderIcon/>}
                                Сохранить
                            </Button>

                    </TooltipTrigger>
                    {!isDirty && <TooltipContent>Вы ничего не изменили</TooltipContent>}
                    </div>
                </Tooltip>


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

export default PortfolioEditForm;