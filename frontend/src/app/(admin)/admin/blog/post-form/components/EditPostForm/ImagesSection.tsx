import React, {useState} from 'react';
import {UseFormRegister, Control, FieldErrors, UseFieldArrayAppend} from 'react-hook-form';
import {Button} from '@/src/components/ui/button';
import {Plus, Eye} from 'lucide-react';
import {Label} from '@/src/components/ui/label';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import {Input} from '@/src/components/ui/input';
import {UpdatePostFormData} from '@/src/lib/zodSchemas/admin/postSchema';
import {ImageObject} from '@/src/lib/types';
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';

interface Props {
    fields: { id: string }[];
    append: UseFieldArrayAppend<UpdatePostFormData, 'images'>;
    remove: (index: number) => void;
    register: UseFormRegister<UpdatePostFormData>;
    control: Control<UpdatePostFormData>;
    errors: FieldErrors<UpdatePostFormData>;
    updateLoading: boolean;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    replaceAllImages: boolean;
    onCancelReplace: () => void;
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
                                            openImagesModal,
                                            setPreviewImage,
                                            setIsPreviewOpen,
                                            handleImageChange,
                                        }) => {

    const [showConfirm, setShowConfirm] = useState(false);

    const handleReplaceConfirm = () => {
        setShowConfirm(false);
        onCancelReplace();
        append({ alt: { ru: "" }, file: null });
    };

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
                            append({alt: {ru: ""}, file: null});
                    }}
                    disabled={updateLoading}
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
                            setShowConfirm(true);
                        }
                    }}
                >
                    {replaceAllImages ? "Отмена" : "Заменить изображения"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setExpanded(prev => !prev)}
                    className="text-sm mb-4"
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
                    <div
                        key={item.id} className="border rounded-lg p-4 space-y-6 bg-white shadow-sm">
                        <Label className="w-full mb-2">Альтернативное название изображения</Label>
                        <Input
                            type="text"
                            placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                            {...register(`images.${index}.alt.ru`)}
                            disabled={updateLoading}
                        />
                        {errors.images?.[index]?.alt?.ru && (
                            <FormErrorMessage>{errors.images[index]?.alt?.ru.message}</FormErrorMessage>
                        )}

                        <Label className="w-full mb-2">Изображение</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            disabled={updateLoading}
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

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Заменить изображения?"
                text="При этом действии ВСЕ предыдущие изображения будут заменены"
                onConfirm={handleReplaceConfirm}
                loading={updateLoading}
            />
        </div>
    );
};

export default ImagesSection;
