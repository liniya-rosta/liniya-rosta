import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    UpdatePostImageFormData,
    updatePostImageSchema
} from "@/lib/zodSchemas/postSchema";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Eye} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import LoaderIcon from "@/components/ui/Loading/LoaderIcon";
import Image from "next/image";
import {API_BASE_URL} from "@/lib/globalConstants";
import {ImageObject} from "@/lib/types";
import {fetchPostById} from "@/actions/posts";
import {toast} from "react-toastify";
import {isAxiosError} from "axios";
import {updatePostImage} from "@/actions/superadmin/posts";

interface Props {
    open: boolean;
    openChange: () => void,
    imageUrl: string;
    onSaved: () => void;
    setPreviewImage: (value: ImageObject) => void;
    setIsPreviewOpen: (value: boolean) => void;
}

const ImageEditForm: React.FC<React.PropsWithChildren<Props>> = (
    {open, openChange, imageUrl, onSaved, setIsPreviewOpen, setPreviewImage}
) => {
    const {
        detailPost,
        updateLoading,
        setDetailPost,
        setUpdateLoading,
    } = useSuperAdminPostStore();


    const found = detailPost?.images.find((img) => img.image === imageUrl);

    const {register, handleSubmit, setValue, reset, control, formState: {errors, isDirty}} = useForm({
        resolver: zodResolver(updatePostImageSchema),
    });

    useEffect(() => {
        if (found) {
            reset({
                alt: found.alt,
                imageUrl,
            });
        }
    }, [found, reset]);

    const showImagePreview = (file: File, alt = "") => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({image: localUrl, alt});
        setIsPreviewOpen(true);
    };

    const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("newImage", file, {shouldDirty: true});
    };

    const onSubmit = async (data: UpdatePostImageFormData) => {
        try {
            if (!detailPost) return;

            setUpdateLoading(true);
            await updatePostImage(detailPost._id, data);
            const updated = await fetchPostById(detailPost._id);
            setDetailPost(updated);

            toast.success("Вы успешно обновили элемент галереи");
            onSaved();
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при редактировании изображения поста";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setUpdateLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Редактировать изображение поста
                    </DialogTitle>
                </DialogHeader>

                {detailPost && found ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input type="hidden" value={imageUrl} {...register("imageUrl")} />

                            <div className="mb-4">
                                <Label htmlFor="alt" className="mb-2">Альтернативный текст</Label>
                                <Input
                                    id="alt"
                                    type="text"
                                    disabled={updateLoading}
                                    {...register("alt")}
                                    className="mb-2"
                                />
                                {errors.alt && (
                                    <p className="text-red-500 text-sm mt-1">{errors.alt.message}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="newImage" className="mb-2">Новое изображение</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="newImage"
                                        type="file"
                                        accept="image/*"
                                        disabled={updateLoading}
                                        onChange={onChangeFile}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={updateLoading}
                                        onClick={() => {
                                            const file = control._formValues.newImage;
                                            if (file instanceof File) {
                                                const localUrl = URL.createObjectURL(file);
                                                showImagePreview(file, control._formValues.alt);
                                                setPreviewImage({ image: localUrl, alt: control._formValues.alt });
                                                setIsPreviewOpen(true);
                                                console.log("open image modal")
                                            }
                                            console.log("open image modal dddddddddd")

                                        }}
                                    >
                                        <Eye className="w-4 h-4"/> Посмотреть
                                    </Button>
                                </div>
                                {errors.newImage && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newImage.message}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <p className="mb-3">Предыдущее изображение</p>
                                <div className="relative w-[200px] h-[200px]">
                                    <Image
                                        src={API_BASE_URL + "/" + found.image}
                                        alt={found.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 200px"
                                        className="object-contain rounded"
                                    />
                                </div>
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="inline-block">
                                        <Button type="submit" disabled={!isDirty || updateLoading}>
                                            {updateLoading && <LoaderIcon/>}
                                            Сохранить
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                {!isDirty && <TooltipContent>Вы ничего не изменили</TooltipContent>}
                            </Tooltip>
                        </form>
                    )
                    : <p>Изображение не найдено или пост не загружен.</p>
                }
            </DialogContent>
        </Dialog>
    )
}

export default ImageEditForm;