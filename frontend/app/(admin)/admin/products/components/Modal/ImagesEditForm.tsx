"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import Image from "next/image";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";
import LoaderIcon from "@/components/ui/Loading/LoaderIcon";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {API_BASE_URL} from "@/lib/globalConstants";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {updateProductImage} from "@/actions/superadmin/products";
import {ImagesEditValues} from "@/lib/types";
import {imagesSchema} from "@/lib/zodSchemas/admin/productSchema";

interface Props {
    onSaved: () => void;
    image: { _id: string; url: string; alt: string };
}

const ImagesEditForm: React.FC<Props> = ({onSaved, image}) => {
    const {setUpdateLoading, updateLoading, setUpdateError} = useAdminProductStore();
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm<ImagesEditValues>({
        resolver: zodResolver(imagesSchema),
        defaultValues: {
            alt: image.alt,
            image: undefined,
        },
    });

    useEffect(() => {
        reset({
            alt: image.alt,
            image: undefined,
        });

        setPreviewUrl(null);
    }, [image._id, image.url, image.alt, reset]);

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("image", file, {shouldDirty: true});

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const onSubmit = async (data: ImagesEditValues) => {
        try {
            setUpdateLoading(true);
            await updateProductImage(image._id, data.image || undefined, data.alt);

            toast.success("Изображение успешно обновлено");
            onSaved();
        } catch (error) {
            let errorMessage = "Ошибка при обновлении изображения";
            if (isAxiosError(error) && error.response) {
                setUpdateError(error.response.data.error);
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-b border-b-gray-500 py-3 mb-4">
                <div className="mb-4">
                    <Label htmlFor="alt" className="mb-2">Альтернативное название</Label>
                    <Input
                        id="alt"
                        type="text"
                        disabled={updateLoading}
                        {...register("alt")}
                    />
                    {errors.alt && (
                        <p className="text-red-500 text-sm mb-4">{errors.alt.message}</p>
                    )}
                </div>

                <div className="mb-3">
                    <div className="flex items-center gap-3 mb-2">
                        <Label htmlFor="image" className="mb-2">Новое изображение</Label>
                        <Input
                            id="image"
                            type="file"
                            disabled={updateLoading}
                            onChange={onChangeFile}
                            accept="image/*"
                        />
                    </div>
                    {errors.image && (
                        <p className="text-red-500 text-sm mb-4">{errors.image.message}</p>
                    )}
                </div>

                <p className="mb-3">Текущее изображение</p>
                <div className="relative w-[200px] h-[200px]">
                    <Image
                        key={previewUrl || image.url}
                        src={previewUrl || `${API_BASE_URL}/${image.url}`}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-contain rounded"
                    />
                </div>
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="inline-block">
                        <Button type="submit" className="mr-auto" disabled={!isDirty || updateLoading}>
                            {updateLoading && <LoaderIcon/>}
                            Сохранить
                        </Button>
                    </div>
                </TooltipTrigger>
                {!isDirty && <TooltipContent>Вы ничего не изменили</TooltipContent>}
            </Tooltip>

        </form>
    );
};

export default ImagesEditForm;