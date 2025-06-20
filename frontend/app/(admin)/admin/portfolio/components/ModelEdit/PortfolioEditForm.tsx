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
import { editPortfolioItem } from "@/actions/superadmin/portfolios";
import FormErrorMessage from "@/components/ui/FormErrorMessage";
import ButtonLoading from "@/components/ui/ButtonLoading";

interface Props {
    onSaved: () => void;
}

const PortfolioEditForm: React.FC<Props> = ({onSaved}) => {
    const {register, handleSubmit, setValue, formState: {errors}} = useForm({
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
            setValue("description", detailItem.description);
            setValue("coverAlt", detailItem.coverAlt);
        }
    }, [detailItem, setValue]);


    const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("cover", file);
    };

    const onSubmit = async (data: PortfolioEditValues) => {
        try {
            if (!detailItem) return;
            setPortfolioEditLoading(true);
            await editPortfolioItem({item: data, id: detailItem._id});
            const updated = await fetchPortfolioPreviews();

            setPortfolioPreview(updated);
            onSaved()
        } catch (e) {
            console.log(e)
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
                        <Image
                            src={API_BASE_URL + "/" + detailItem.cover}
                            alt={detailItem.coverAlt}
                            width={200}
                            height={200}
                            className="object-contain rounded"
                        />
                    </>

                )}
            </div>

            {editLoading ? <ButtonLoading/>
                :<Button type="submit" className="mr-auto">
                    Сохранить
                </Button>
            }
        </form>
    )
}

export default PortfolioEditForm;