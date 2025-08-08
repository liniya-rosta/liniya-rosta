import React, {useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createPost} from '@/actions/superadmin/posts';
import {Input} from '@/src/components/ui/input';
import {Button} from '@/src/components/ui/button';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import LoaderIcon from '@/src/components/ui/Loading/LoaderIcon';
import {Eye, Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {isAxiosError} from 'axios';
import {toast} from 'react-toastify';
import {CreatePostFormData, createPostSchema} from "@/src/lib/zodSchemas/admin/postSchema";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import Link from "next/link";
import {ImageObject} from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import FroalaEditorWrapper from "@/src/components/shared/FroalaEditor";
import {Label} from "@/src/components/ui/label";

interface Props {
    setIsPreviewOpen: (value: boolean) => void;
    setPreviewImage: (image: ImageObject | null) => void;
}

const CreatePostForm: React.FC<Props> = ({setIsPreviewOpen, setPreviewImage}) => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: {errors, isDirty}
    } = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
    });

    const {fields, append, remove} = useFieldArray({control, name: 'images'});
    const router = useRouter();

    const {createLoading, setCreateLoading} = useSuperAdminPostStore();
    const [expanded, setExpanded] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const showImagePreview = (file: File, alt = {ru: "" }) => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({image: localUrl, alt});
        setIsPreviewOpen(true);
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(`images.${index}.file`, file, {shouldValidate: true});
    };

    const handleAltChange = (index: number, value: string) => {
        setValue(`images.${index}.alt.ru`, value, {shouldValidate: true});
    };

    const onSubmit = async (data: CreatePostFormData) => {
        try {
            setCreateLoading(true);
            await createPost(data);
            toast.success("Пост успешно создан");
            router.push('/admin/blog');
        } catch (error) {
            let message = 'Ошибка при создании поста';
            if (isAxiosError(error) && error.response) {
                message = error.response.data.error;
            }
            toast.error(message);
        } finally {
            setCreateLoading(false);
        }
    };

    const confirmTitle = "Покинуть страницу?";
    const confirmDescription = "Если покинете страницу то введённые данные будут потеряны";

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-b-gray-500 py-3 mb-4">
                    <Label className="mb-2 block">Заголовок поста</Label>
                    <Input
                        type="text"
                        placeholder="Введите цепляющий заголовок"
                        {...register('title.ru')}
                        disabled={createLoading}
                        className="mb-2"
                    />
                    {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}


                     <Input
                        type="text"
                        placeholder="SEO заголовок"
                        disabled={createLoading}
                        {...register('seoTitle.ru')}
                        className="mb-2"
                    />
                    {errors.seoTitle && <FormErrorMessage>{errors.seoTitle.message}</FormErrorMessage>}
        
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Описание</label>
                        <FroalaEditorWrapper
                            model={control._formValues.description?.ru}
                            onChangeAction={(value: string) => setValue('description.ru', value, {shouldValidate: true})}
                        />
                        {errors.description?.ru &&
                            <FormErrorMessage>{errors.description.ru.message}</FormErrorMessage>}
                    </div>

                    <Input
                        type="text"
                        placeholder="SEO описание"
                        {...register('seoDescription.ru')}
                        disabled={createLoading}
                        className="mb-4"
                    />
                    {errors.seoDescription && <FormErrorMessage>{errors.seoDescription.message}</FormErrorMessage>}
                </div>

                <div className="w-full max-w-4xl mb-3">
                    <label className="block mb-4">Изображения:</label>
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

                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${expanded ? 'max-h-none overflow-visible' : 'max-h-[350px] overflow-y-auto'}`}>
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
                                {errors.images?.[index]?.alt && (
                                    <FormErrorMessage>{errors.images[index]?.alt?.message}</FormErrorMessage>
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
                                                showImagePreview(file, control._formValues.images[index]?.alt);
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

                <div className="flex flex-wrap gap-1 md:gap-5">
                    <Button
                        type="submit"
                        className="mt-6 px-6"
                        disabled={createLoading || !isDirty}
                    >
                        {createLoading && <LoaderIcon/>}
                        Создать пост
                    </Button>
                    <Link href="/admin/blog">
                        <Button
                            type="button"
                            className="mt-6 px-6"
                            disabled={createLoading}
                            variant="outline"
                        >
                            Отмена
                        </Button>
                    </Link>
                </div>
            </form>


            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={confirmTitle}
                text={confirmDescription}
                onConfirm={() => {
                    setShowConfirm(false);
                }}
                loading={createLoading}
            />
        </>
    );
};

export default CreatePostForm;