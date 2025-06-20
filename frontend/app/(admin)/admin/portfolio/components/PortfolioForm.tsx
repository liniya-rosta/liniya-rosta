'use client'

import {useForm, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {portfolioSchema} from "@/lib/zodSchemas/portfolio/portfolioSchema";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {PortfolioMutation} from "@/lib/types";
import { Plus } from "lucide-react";
import {useRouter} from "next/navigation";
import { createPortfolio } from "@/actions/superadmin/portfolios";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import FormErrorMessage from "@/components/ui/FormErrorMessage";
import ButtonLoading from "@/components/ui/ButtonLoading";

const PortfolioForm= () => {
    const {
        register, handleSubmit, setValue, control, trigger, formState: {errors}
    } = useForm({resolver: zodResolver(portfolioSchema),});

    const {createLoading, setPortfolioCreateLoading} = useSuperAdminPortfolioStore();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "gallery",
    });

    const router = useRouter();

    const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setValue("cover", file);
        await trigger("cover");
    };

    const onGalleryChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(`gallery.${index}.image`, file, { shouldValidate: true });
    };

    const handleAltChange = (index: number, value: string) => {
        setValue(`gallery.${index}.alt`, value, { shouldValidate: true });
    };

    const onSubmit = async (data: PortfolioMutation) => {
        try {
            setPortfolioCreateLoading(true)
            await createPortfolio(data)
            router.push("/admin/portfolio");
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при создании портфолио";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                autoClose: 3000,
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setPortfolioCreateLoading(false);
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
                        disabled={createLoading}
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
                        disabled={createLoading}
                        {...register("coverAlt")}
                    />
                    {errors.coverAlt && (
                        <FormErrorMessage>{errors.coverAlt.message}</FormErrorMessage>
                    )}
                </div>

                <div>
                    <Input
                        className="mb-3"
                        type="file"
                        placeholder="Обложка"
                        disabled={createLoading}
                        onChange={onCoverChange}
                        accept="image/*"
                    />
                    {errors.cover && (
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
                    onClick={() => append({ alt: "", image: null })}
                    disabled={createLoading}
                    className="flex items-center gap-1 mb-4"
                >
                    <Plus className="w-4 h-4" />
                    Добавить изображение
                </Button>

                <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                    {fields.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                            <Input
                                type="text"
                                placeholder="Альтернативное название изображения"
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
                    ))}
                </div>
            </div>

            {createLoading ? <ButtonLoading/>
                : <Button type="submit" className="mr-auto">
                    Создать
                </Button>
            }
        </form>
    )

}
export default PortfolioForm;