import React from 'react';
import {UseFormRegister, Control, UseFormSetValue, FieldErrors} from 'react-hook-form';
import {CreatePostFormData} from "@/src/lib/zodSchemas/admin/postSchema";
import {Input} from '@/src/components/ui/input';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import FroalaEditorWrapper from "@/src/components/shared/FroalaEditor";
import {Label} from "@/src/components/ui/label";
import {Textarea} from "@/src/components/ui/textarea";

interface Props {
    register: UseFormRegister<CreatePostFormData>;
    errors: FieldErrors<CreatePostFormData>;
    control: Control<CreatePostFormData>;
    setValue: UseFormSetValue<CreatePostFormData>;
    createLoading: boolean;
    descriptionValue: string;
}

const PostBasicInfo: React.FC<Props> = ({register, errors, descriptionValue, setValue, createLoading}) => {
    return (
        <div className="border-b border-b-gray-500 py-3 mb-4">
            <Label className="mb-2 block">Заголовок поста</Label>
            <Input
                type="text"
                placeholder="Введите цепляющий заголовок"
                {...register('title.ru')}
                disabled={createLoading}
                className="mb-2"
            />

            {errors.title && errors.title.ru &&
                <FormErrorMessage className="mb-4">{errors.title.ru.message}</FormErrorMessage>
            }

            <Label className="mb-2 block">SEO заголовок</Label>
            <Input
                type="text"
                placeholder="SEO заголовок"
                disabled={createLoading}
                {...register('seoTitle.ru')}
                className="mb-2"
            />
            {errors.seoTitle && errors.seoTitle.ru &&
                <FormErrorMessage className="mb-4">{errors.seoTitle.ru.message}</FormErrorMessage>
            }

            <div className="mb-4">
                <Label className="block mb-2 text-sm font-medium">Описание</Label>
                <FroalaEditorWrapper
                    model={descriptionValue}
                    onChangeAction={(value: string) => setValue('description.ru', value, {shouldValidate: true})}
                />
                {errors.description?.ru &&
                    <FormErrorMessage className="mb-4">{errors.description.ru.message}</FormErrorMessage>}
            </div>

            <Label className="mb-2 block">SEO описание</Label>
            <Textarea
                placeholder="SEO описание"
                {...register('seoDescription.ru')}
                disabled={createLoading}
                className="mb-4"
            />
            {errors.seoDescription && errors.seoDescription.ru && <FormErrorMessage>{errors.seoDescription.ru.message}</FormErrorMessage>}
        </div>
    );
};

export default PostBasicInfo;