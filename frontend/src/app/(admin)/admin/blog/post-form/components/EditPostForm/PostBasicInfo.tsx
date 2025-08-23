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
    <div className="border-b border-b-gray-500 py-3 space-y-4">
        <div className="space-y-1">
            <Label className="block">Заголовок поста</Label>
            <Input
                type="text"
                placeholder="Введите цепляющий заголовок"
                {...register('title.ru')}
                disabled={updateLoading}
            />
            {errors.title?.ru &&
                <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>}
        </div>

        <div className="space-y-1">
            <Label className="block">SEO заголовок</Label>
            <Input
                type="text"
                placeholder="Заголовок, который видят в поиске в интернете"
                disabled={updateLoading}
                {...register('seoTitle.ru')}
            />
            {errors.seoTitle?.ru &&
                <FormErrorMessage>{errors.seoTitle.ru.message}</FormErrorMessage>}
        </div>

        <div className="space-y-1">
            <Label className="block mb-2 text-sm font-medium">Описание</Label>
            <FroalaEditorWrapper
                key={detailPost?._id ?? 'editor'}
                model={descriptionValue ?? detailPost?.description?.ru ?? ''}
                onChangeAction={(value: string) => setValue('description.ru', value, {shouldValidate: true})}
            />
            {errors.description?.ru &&
                <FormErrorMessage>{errors.description.ru.message}</FormErrorMessage>}
        </div>

        <div className="space-y-1">
            <Label className="block">SEO описание</Label>
            <Input
                type="text"
                placeholder="Краткий текст, который отображается в результатах поиска и служит для привлечения внимания пользователя, побуждая его перейти на ваш сайт."
                {...register('seoDescription.ru')}
                disabled={updateLoading}
                className="mb-4"
            />
            {errors.seoDescription?.ru &&
                <FormErrorMessage>{errors.seoDescription.ru.message}</FormErrorMessage>}
        </div>
    </div>
);

export default PostBasicInfo;
