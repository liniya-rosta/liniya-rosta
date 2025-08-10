import React from 'react';
import {UseFormRegister, Control, FieldErrors} from 'react-hook-form';
import {Button} from '@/src/components/ui/button';
import {Plus, Eye} from 'lucide-react';
import {Label} from '@/src/components/ui/label';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import {Input} from '@/src/components/ui/input';
import {UpdatePostFormData} from '@/src/lib/zodSchemas/admin/postSchema';
import {ImageObject} from '@/src/lib/types';

interface Props {
    fields: any[];
    append: (value: any) => void;
    remove: (index: number) => void;
    register: UseFormRegister<UpdatePostFormData>;
    control: Control<UpdatePostFormData>;
    errors: FieldErrors<UpdatePostFormData>;
    updateLoading: boolean;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    replaceAllImages: boolean;
    onCancelReplace: () => void;
    requestConfirmation: (type: "replace" | "backToPage") => void;
    openImagesModal: () => void;
    setPreviewImage: (image: ImageObject | null) => void;
    setIsPreviewOpen: (value: boolean) => void;
    handleImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesSection: React.FC<Props> = ({
                                            fields,
                                            append,
                                            remove,
                                            register,
                                            control,
                                            errors,
                                            updateLoading,
                                            expanded,
                                            setExpanded,
                                            replaceAllImages,
                                            onCancelReplace,
                                            requestConfirmation,
                                            openImagesModal,
                                            setPreviewImage,
                                            setIsPreviewOpen,
                                            handleImageChange,
                                        }) => {

    const showImagePreview = (file: File, alt = {ru: ""}) => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({image: localUrl, alt});
        setIsPreviewOpen(true);
    };

    return (
        <div className="w-full max-w-4xl mb-3">
            <label className="block mb-4">Изображения:</label>

            <div className="flex flex-wrap gap-2 md:gap-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (fields.length < 3) {
                            append({alt: {ru: ""}, file: null});
                        }
                    }}
                    disabled={updateLoading || fields.length >= 3}
                    className="mb-4"
                >
                    <Plus className="w-4 h-4 mr-2"/>
                    Добавить изображение
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={updateLoading || replaceAllImages}
                    onClick={openImagesModal}
                >
                    Просмотреть старые изображения
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={updateLoading}
                    onClick={() => {
                        if (replaceAllImages) {
                            onCancelReplace();
                        } else {
                            requestConfirmation("replace");
                        }
                    }}
                >
                    {replaceAllImages ? "Отмена" : "Заменить изображения"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setExpanded(prev => !prev)}
                    className="text-sm"
                    disabled={updateLoading || fields.length < 5}
                >
                    {expanded ? 'Свернуть' : 'Развернуть все'}
                </Button>
            </div>
            {errors.images?.message && (
                <FormErrorMessage>{errors.images.message}</FormErrorMessage>
            )}

            <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${
                    expanded ? 'max-h-none overflow-visible' : 'max-h-[350px] overflow-y-auto'
                }`}
            >
                {fields.map((item, index) => (
                    <div key={item._id} className="border rounded-lg p-4 space-y-6 bg-white shadow-sm">
                        <Label className="w-full mb-2">Альтернативное название изображения</Label>
                        <Input
                            type="text"
                            placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                            {...register(`images.${index}.alt.ru`)}
                            disabled={updateLoading}
                        />
                        {errors.images?.[index]?.alt && (
                            <FormErrorMessage>{errors.images[index]?.alt?.message}</FormErrorMessage>
                        )}

                        <Label className="w-full mb-2">Изображение</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            disabled={updateLoading}
                            {...register(`images.${index}.file`)}
                            onChange={(e) => handleImageChange(index, e)}
                        />
                        {errors.images?.[index]?.file && (
                            <FormErrorMessage>{errors.images[index]?.file?.message}</FormErrorMessage>
                        )}

                        <div className="flex flex-wrap items-center justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={updateLoading}
                                onClick={() => {
                                    const file = control._formValues.images?.[index]?.file;
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
                                onClick={() => remove(index)}
                                disabled={updateLoading}
                            >
                                Удалить
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImagesSection;
