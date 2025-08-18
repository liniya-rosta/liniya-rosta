import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import React, {useEffect, useState} from "react";
import {GalleryEditValues} from "@/src/lib/types";
import {Input} from "@/src/components/ui/input";
import Image from "next/image";
import {Button} from "@/src/components/ui/button";
import {editGalleryItem} from "@/actions/superadmin/portfolios";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import {toast} from "react-toastify";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import {fetchPortfolioItem} from "@/actions/portfolios";
import {Eye} from "lucide-react";
import {Label} from "@/src/components/ui/label";
import ImageModal from "@/src/app/(admin)/admin/portfolio/components/ImageModal";
import {gallerySchema} from "@/src/lib/zodSchemas/admin/portfolioSchema";
import {handleKyError} from "@/src/lib/handleKyError";
import {IMG_BASE} from "@/src/lib/globalConstants";

interface Props {
    onSaved: () => void;
}

const GalleryEditForm: React.FC<Props> = ({onSaved}) => {
    const {register, handleSubmit, setValue, reset, control, formState: {errors, isDirty}} = useForm({
        resolver: zodResolver(gallerySchema),
    });

    const {
        galleryItem,
        editLoading,
        detailItem,
        setPortfolioEditLoading,
        setPortfolioItemDetail,
    } = useSuperAdminPortfolioStore();

    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string }>({url: "", alt: ""});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const showImagePreview = (file: File, alt = "") => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({url: localUrl, alt});
        setIsPreviewOpen(true);
    };

    useEffect(() => {
        if (galleryItem) {
            reset({
                alt: {ru: galleryItem.alt.ru},
            });
        }
    }, [galleryItem, reset]);


    const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("image", file, {shouldDirty: true});
    };

    const onSubmit = async (data: GalleryEditValues) => {
        if (!galleryItem) return;

        try {
            setPortfolioEditLoading(true);
            await editGalleryItem({item: data, gallery_id: galleryItem._id});


            toast.success("Вы успешно обновили элемент галереи");

            if (detailItem) {
                const updated = await fetchPortfolioItem(detailItem._id);
                setPortfolioItemDetail(updated);
            }

            onSaved();
        } catch (error) {
            const msg = await handleKyError(error, "Неизвестная ошибка при редактировании элемента галереи");
            toast.error(msg);
        } finally {
            setPortfolioEditLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-b border-b-gray-500 py-3 mb-4">
                <div className="mb-4">
                    <Label htmlFor="alt" className="mb-2">Альтернативное название изображения</Label>
                    <Input
                        id="alt"
                        className="mb-2"
                        type="text"
                        disabled={editLoading}
                        {...register("alt.ru")}
                    />
                    {errors.alt && (
                        <p className="text-red-500 text-sm mb-4">{errors.alt.message}</p>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="image" className="mb-2">Изображение</Label>
                    <div className="flex gap-3 mb-2">
                        <Input
                            id="image"
                            type="file"
                            disabled={editLoading}
                            onChange={onChangeFile}
                            accept="image/*"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            disabled={editLoading}
                            onClick={() => {
                                const file = control._formValues.image;
                                if (file instanceof File) {
                                    showImagePreview(file, control._formValues.alt);
                                }
                            }}
                        >
                            <Eye className="w-4 h-4"/> Посмотреть
                        </Button>

                    </div>
                    {errors.image && (
                        <p className="text-red-500 text-sm mb-4">{errors.image.message}</p>
                    )}
                </div>

                {galleryItem && (
                    <>
                        <p className="mb-3">Предыдущее изображение</p>
                        <div className="relative w-[200px] h-[200px]">
                            <Image
                                src={IMG_BASE + "/" + galleryItem.image}
                                alt={galleryItem.alt.ru}
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

            <ImageModal
                open={isPreviewOpen}
                openChange={() => setIsPreviewOpen(false)}
                image={previewImage.url}
                alt={previewImage.alt || "Предпросмотр изображения"}
            />
        </form>
    )
};

export default GalleryEditForm;