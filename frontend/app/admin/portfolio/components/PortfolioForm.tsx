'use client'
import {useForm, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {portfolioSchema} from "@/lib/zodSchemas/portfolioSchema";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {PortfolioMutation} from "@/lib/types";
import { Plus } from "lucide-react";
import {createPortfolioAdmin} from "@/actions/portfolios";

interface Props {
    isEdit?: boolean;
}

const PortfolioForm: React.FC<Props>= () => {
    const {register, handleSubmit, setValue, control, trigger, formState: {errors}} = useForm({
            resolver: zodResolver(portfolioSchema),
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "gallery",
    });

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
            await createPortfolioAdmin(data)
            console.log(data)

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
            </div>

            <div className="w-full max-w-4xl mb-3">
                <label className="block mb-4">Галерея:</label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ alt: "", image: null })}
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
                                onChange={(e) => handleAltChange(index, e.target.value)}
                                className="mb-3"
                            />
                            {errors.gallery?.[index]?.alt && (
                                <p className="text-red-500 text-sm">
                                    {errors.gallery[index]?.alt?.message}
                                </p>
                            )}

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onGalleryChange(index, e)}
                            />
                            {errors.gallery?.[index]?.image && (
                                <p className="text-red-500 text-sm">
                                    {errors.gallery[index]?.image?.message}
                                </p>
                            )}

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => remove(index)}
                            >
                                Удалить
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" className="mr-auto">
               Создать
            </Button>
        </form>
    )

}
export default PortfolioForm;