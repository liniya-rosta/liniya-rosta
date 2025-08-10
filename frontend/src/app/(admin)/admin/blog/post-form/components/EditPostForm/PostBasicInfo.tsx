import React from 'react';
import {UseFormRegister, UseFormSetValue, FieldErrors} from 'react-hook-form';
import {Input} from '@/src/components/ui/input';
import {Label} from '@/src/components/ui/label';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import FroalaEditorWrapper from '@/src/components/shared/FroalaEditor';
import {UpdatePostFormData} from '@/src/lib/zodSchemas/admin/postSchema';
import {Post} from "@/src/lib/types";

interface Props {
    register: UseFormRegister<UpdatePostFormData>;
    errors: FieldErrors<UpdatePostFormData>;
    descriptionValue: string;
    setValue: UseFormSetValue<UpdatePostFormData>;
    updateLoading: boolean;
    detailPost: Post;
}

const PostBasicInfo: React.FC<Props> = ({register, errors, descriptionValue, setValue, updateLoading, detailPost}) => (
    <div className="border-b border-b-gray-500 py-3 mb-4">
        <Label className="mb-2 block">Заголовок поста</Label>
        <Input
            type="text"
            placeholder="Введите цепляющий заголовок"
            {...register('title.ru')}
            disabled={updateLoading}
            className="mb-2"
        />
        {errors.title?.ru &&
            <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>}

        <Label className="mb-2 block">SEO заголовок</Label>
        <Input
            type="text"
            placeholder="SEO заголовок"
            disabled={updateLoading}
            {...register('seoTitle.ru')}
            className="mb-2"
        />
        {errors.seoTitle?.ru &&
            <FormErrorMessage>{errors.seoTitle.ru.message}</FormErrorMessage>}

        <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Описание</label>
            <FroalaEditorWrapper
                key={detailPost?._id ?? 'editor'}
                model={descriptionValue ?? detailPost?.description?.ru ?? ''}
                onChangeAction={(value: string) => setValue('description.ru', value, {shouldValidate: true})}
            />
            {errors.description?.ru &&
                <FormErrorMessage>{errors.description.ru.message}</FormErrorMessage>}
        </div>

        <Label className="mb-2 block">SEO описание</Label>
        <Input
            type="text"
            placeholder="SEO описание"
            {...register('seoDescription.ru')}
            disabled={updateLoading}
            className="mb-4"
        />
        {errors.seoDescription?.ru &&
            <FormErrorMessage>{errors.seoDescription.ru.message}</FormErrorMessage>}
    </div>
);

export default PostBasicInfo;
