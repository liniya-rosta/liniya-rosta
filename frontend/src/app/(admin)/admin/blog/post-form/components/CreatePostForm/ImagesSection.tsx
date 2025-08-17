import React from 'react';
import {UseFieldArrayRemove, UseFieldArrayAppend, UseFormRegister, Control, FieldErrors} from 'react-hook-form';
import {CreatePostFormData} from "@/src/lib/zodSchemas/admin/postSchema";
import {Button} from '@/src/components/ui/button';
import {Input} from '@/src/components/ui/input';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import {Eye, Plus} from 'lucide-react';
import {Label} from "@/src/components/ui/label";
import {ImageObject} from "@/src/lib/types";

interface Props {
    fields: { id: string }[];
    append: UseFieldArrayAppend<CreatePostFormData, 'images'>;
    remove: UseFieldArrayRemove;
    register: UseFormRegister<CreatePostFormData>;
    control: Control<CreatePostFormData>;
    errors: FieldErrors<CreatePostFormData>;
    createLoading: boolean;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    showImagePreview: (file: File, alt?: ImageObject['alt']) => void;
    handleAltChange: (index: number, value: string) => void;
    handleImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesSection: React.FC<Props> = ({
                                            fields,
                                            append,
                                            remove,
                                            register,
                                            control,
                                            errors,
                                            createLoading,
                                            expanded,
                                            setExpanded,
                                            showImagePreview,
                                            handleAltChange,
                                            handleImageChange,
                                        }) => {

    console.log(errors)
    return (
        <div className="w-full max-w-4xl mb-3">
            <Label className="block mb-4">Изображения:</Label>

            <div className="flex flex-wrap gap-2 mb-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({alt: {ru: ""}, file: null})}
                    disabled={createLoading}
                    className="mb-4"
                >
                    <Plus className="w-4 h-4 mr-2"/>
                    Добавить изображение
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setExpanded(prev => !prev)}
                    className="text-sm"
                    disabled={createLoading || fields.length === 0}
                >
                    {expanded ? 'Свернуть' : 'Развернуть все'}
                </Button>
            </div>

            {errors.images && typeof errors.images === 'object' && !Array.isArray(errors.images) && errors.images.message && (
                <FormErrorMessage>{errors.images.message}</FormErrorMessage>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${expanded ? 'max-h-none overflow-visible' : 'max-h-[350px] overflow-y-auto'}`}>
                {fields.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-6 bg-white shadow-sm">
                        <Label className="w-full mb-2">Альтернативное название изображения</Label>
                        <Input
                            type="text"
                            placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                            {...register(`images.${index}.alt.ru`)}
                            disabled={createLoading}
                            onChange={(e) => handleAltChange(index, e.target.value)}
                        />
                        {errors.images?.[index]?.alt?.ru && (
                            <FormErrorMessage>{errors.images[index]?.alt?.ru.message}</FormErrorMessage>
                        )}

                        <Label className="w-full mb-2">Изображение</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            disabled={createLoading}
                            onChange={(e) => handleImageChange(index, e)}
                        />
                        {errors.images?.[index]?.file && (
                            <FormErrorMessage>{errors.images[index]?.file?.message}</FormErrorMessage>
                        )}

                        <div className="flex flex-wrap gap-3 justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const file = control._formValues.images[index]?.file;
                                    if (file instanceof File) {
                                        showImagePreview(file, control._formValues.images[index]?.alt.ru);
                                    }
                                }}
                                disabled={createLoading}
                            >
                                <Eye className="w-4 h-4"/>
                                <span className="hidden md:inline">Посмотреть изображение</span>
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => remove(index)}
                                disabled={createLoading}
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