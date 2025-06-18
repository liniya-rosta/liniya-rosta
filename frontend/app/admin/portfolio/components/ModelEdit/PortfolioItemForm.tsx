'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {portfolioItemSchema} from "@/lib/zodSchemas/portfolio/portfolioItemSchema";
import {useForm} from "react-hook-form";
import {PortfolioEditValues} from "@/lib/types";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useEffect} from "react";
import {editPortfolioItemSuperAdmin, fetchPortfolioPreviews} from "@/actions/portfolios";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";

const EditPortfolioItem = () => {
    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm({
        resolver: zodResolver(portfolioItemSchema),
    });

    const {detailItem, setPortfolioPreview} = useSuperAdminPortfolioStore();

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
            await editPortfolioItemSuperAdmin({item: data, id: detailItem._id});
            const updated = await fetchPortfolioPreviews();

            setPortfolioPreview(updated);

        } catch (e) {
            console.log(e)
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
                        value={watch("description")}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mb-4">{errors.description.message}</p>
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
                        <p className="text-red-500 text-sm mb-4">{errors.coverAlt.message}</p>
                    )}
                </div>

                <div>
                    <Input
                        className="mb-3"
                        type="file"
                        placeholder="Обложка"
                        onChange={onCoverChange}
                        accept="image/*"
                    />
                    {errors.cover && (
                        <p className="text-red-500 text-sm">{errors.cover.message}</p>
                    )}
                </div>
                {detailItem && (
                    <Image
                        src={API_BASE_URL + "/" + detailItem.cover}
                        alt={detailItem.coverAlt}
                        width={200}
                        height={200}
                        className="object-contain rounded"
                    />
                )}
            </div>

            <Button type="submit" className="mr-auto">
                Сохранить
            </Button>
        </form>
    )
}

export default EditPortfolioItem;