import React, {useState} from "react";
import {
    UseFormRegister,
    Control,
    FieldErrors,
    UseFieldArrayAppend, UseFormSetValue,
} from "react-hook-form";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import {Label} from "@/src/components/ui/label";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {ImageObject, PortfolioEditValues} from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {Eye, Plus} from "lucide-react";

interface Props {
    fields: { id: string }[];
    append: UseFieldArrayAppend<PortfolioEditValues, "gallery">;
    remove: (index: number) => void;
    register: UseFormRegister<PortfolioEditValues>;
    control: Control<PortfolioEditValues>;
    errors: FieldErrors<PortfolioEditValues>;
    loading: boolean;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    openImagesModal: () => void;
    replaceAllImages: boolean;
    setReplaceAllImages: (value: boolean) => void;
    requestConfirmation: (type: "replace" | "append") => void;
    setValue: UseFormSetValue<PortfolioEditValues>;
    setPreviewImage: (image: ImageObject | null) => void;
    setIsPreviewOpen: (value: boolean) => void;
}

const PortfolioImagesSection: React.FC<Props> = ({
                                                     fields,
                                                     append,
                                                     remove,
                                                     register,
                                                     errors,
                                                     loading,
                                                     control,
                                                     replaceAllImages,
                                                     requestConfirmation,
                                                     setValue,
                                                    openImagesModal,
                                                    setPreviewImage,
                                                    setIsPreviewOpen,
                                                    expanded,
                                                    setExpanded
                                                 }) => {

    const [showConfirm, setShowConfirm] = useState(false);

    const showImagePreview = (file: File, alt = {ru: ""}) => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({image: localUrl, alt});
        setIsPreviewOpen(true);
    };

    return (
        <div className="w-full max-w-4xl mb-3">
            <label className="block mb-4">Галерея:</label>
            <div className="flex flex-wrap gap-2 md:gap-5 mb-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({alt: {ru: ""}, image: null})}
                    disabled={loading}
                >
                    <Plus className="w-4 h-4 mr-2"/>
                    Добавить в галерею
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    disabled={loading || replaceAllImages}
                    onClick={openImagesModal}
                >
                    Просмотреть старые изображения
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={() => {
                        if (replaceAllImages) {
                            requestConfirmation("append");
                        } else {
                            setShowConfirm(true);
                        }
                    }}
                >
                    {replaceAllImages ? "Отмена" : "Заменить галерею"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setExpanded(prev => !prev)}
                    className="text-sm"
                    disabled={loading || fields.length < 5}
                >
                    {expanded ? 'Свернуть' : 'Развернуть все'}
                </Button>
            </div>

            <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${
                    expanded ? 'max-h-none overflow-visible' : 'max-h-[500px] overflow-y-auto'
                }`}
            >
                {fields.map((field, index) => (
                    <div
                        key={field.id} className="border rounded-lg p-4 space-y-6 bg-white shadow-sm">
                        <div className="space-y-1">
                            <Label>Alt</Label>
                            <Input
                                {...register(`gallery.${index}.alt.ru` as const)}
                                disabled={loading}
                                placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                            />
                            {errors.gallery?.[index]?.alt?.ru && (
                                <FormErrorMessage>
                                    {errors.gallery[index]?.alt?.ru?.message}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Изображение</Label>
                            <Input
                                type="file"
                                disabled={loading}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setValue(`gallery.${index}.image`, file, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                            />
                            {errors.gallery?.[index]?.image && (
                                <FormErrorMessage>
                                    {errors.gallery[index]?.image?.message as string}
                                </FormErrorMessage>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => {
                                    const file = control._formValues.images?.[index]?.image;
                                    if (file instanceof File) {
                                        showImagePreview(file, control._formValues.images[index]?.alt);
                                    }
                                }}
                            >
                                <Eye className="w-4 h-4"/>
                                <span className="hidden md:inline">Посмотреть изображение</span>
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                                onClick={() => remove(index)}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Заменить изображения?"
                text="Все старые изображения в галереи будут заменены."
                onConfirm={() => {
                    requestConfirmation("replace");
                    setShowConfirm(false);
                }}
                loading={loading}
            />
        </div>
    );
};

export default PortfolioImagesSection;
