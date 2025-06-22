'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {portfolioItemSchema} from "@/lib/zodSchemas/portfolio/portfolioItemSchema";
import {useForm} from "react-hook-form";
import {PortfolioEditValues} from "@/lib/types";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useEffect} from "react";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {editPortfolioItem} from "@/actions/superadmin/portfolios";
import FormErrorMessage from "@/components/ui/FormErrorMessage";
import LoaderIcon from "@/components/ui/LoaderIcon";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface Props {
    onSaved: () => void;
}

const PortfolioEditForm: React.FC<Props> = ({onSaved}) => {
    const {register, handleSubmit, setValue, reset, formState: {errors, isDirty}} = useForm({
        resolver: zodResolver(portfolioItemSchema),
    });

    const {
        detailItem,
        editLoading,
        setPortfolioPreview,
        setPortfolioEditLoading
    } = useSuperAdminPortfolioStore();

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
            const updated = await fetchPortfolioPreviews();

            setPortfolioPreview(updated);
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-b border-b-gray-500 py-3 mb-4">
                <div>
                    <Input
                        className="mb-3"
                        type="text"
                        placeholder="Описание"
                        disabled={editLoading}
                        {...register("description")}
                    />
                    {errors.description && (
                        <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                    )}
                </div>

                <div>
                    <Input
                        className="mb-3"
                        type="text"
                        disabled={editLoading}
                        placeholder="Алтернативное название обложки"
                        {...register("coverAlt")}
                    />
                    {errors.coverAlt && (
                        <FormErrorMessage>{errors.coverAlt.message}</FormErrorMessage>
                    )}
                </div>

                <div className="mb-3">
                    <Input
                        className="mb-3"
                        type="file"
                        placeholder="Обложка"
                        disabled={editLoading}
                        onChange={onCoverChange}
                        accept="image/*"
                    />
                    {errors.cover && (
                        <FormErrorMessage>{errors.cover.message}</FormErrorMessage>
                    )}
                </div>
                {detailItem && (
                    <>
                        <p className="mb-3">Предыдущее изображение</p>
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
                <TooltipTrigger asChild>
                    <div className="inline-block">
                        <Button type="submit" className="mr-auto" disabled={!isDirty || editLoading}>
                            {editLoading && <LoaderIcon/>}
                            Сохранить
                        </Button>
                    </div>
                </TooltipTrigger>
                {!isDirty && <TooltipContent>Вы ничего не изменили</TooltipContent>}
            </Tooltip>

        </form>
    )
}

export default PortfolioEditForm;