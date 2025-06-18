import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import React, {useEffect} from "react";
import {GalleryItemValues} from "@/lib/types";
import {gallerySchema} from "@/lib/zodSchemas/portfolio/gallerySchema";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {API_BASE_URL} from "@/lib/globalConstants";
import {Button} from "@/components/ui/button";
import {editGalleryItemSuperAdmin} from "@/actions/portfolios";

interface Props {
    onSaved: () => void;
}

const EditGalleryForm: React.FC<Props> = ({onSaved}) => {
    const {register, handleSubmit, setValue, formState: {errors}} = useForm({
        resolver: zodResolver(gallerySchema),
    });

    const {galleryItem} = useSuperAdminPortfolioStore();

    useEffect(() => {
        if (galleryItem) {
            setValue("alt", galleryItem.alt);
        }
    }, [galleryItem, setValue]);


    const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue("image", file);
    };

    const onSubmit = async (data: GalleryItemValues) => {
        try {
            if (!galleryItem) return;
            await editGalleryItemSuperAdmin({item: data, gallery_id: galleryItem._id});
            onSaved();
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
                        {...register("alt")}
                    />
                    {errors.alt && (
                        <p className="text-red-500 text-sm mb-4">{errors.alt.message}</p>
                    )}
                </div>

                <div className="mb-3">
                    <Input
                        className="mb-3"
                        type="file"
                        placeholder="Обложка"
                        onChange={onChangeFile}
                        accept="image/*"
                    />
                    {errors.image && (
                        <p className="text-red-500 text-sm mb-4">{errors.image.message}</p>
                    )}
                </div>
                {galleryItem && (
                    <>
                        <p className="mb-3">Предыдущее изображение</p>
                        <Image
                            src={API_BASE_URL + "/" + galleryItem.image}
                            alt={galleryItem.alt}
                            width={200}
                            height={200}
                            className="object-contain rounded"
                        />
                    </>
                )}
            </div>
            <Button type="submit" className="mr-auto">
                Сохранить
            </Button>
        </form>
    )
};

export default EditGalleryForm;