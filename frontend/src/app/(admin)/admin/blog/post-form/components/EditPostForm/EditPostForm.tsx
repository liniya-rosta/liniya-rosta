import React, {useEffect, useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from '@/src/components/ui/input';
import {Button} from '@/src/components/ui/button';
import FormErrorMessage from '@/src/components/ui/FormErrorMessage';
import LoaderIcon from '@/src/components/ui/Loading/LoaderIcon';
import {Eye, Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {updatePost} from '@/actions/superadmin/posts';
import {UpdatePostFormData, updatePostSchema} from '@/src/lib/zodSchemas/admin/postSchema';
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {ImageObject} from "@/src/lib/types";
import {Label} from "@/src/components/ui/label";
import FroalaEditorWrapper from "@/src/components/shared/FroalaEditor";
import {handleKyError} from "@/src/lib/handleKyError";

interface Props {
    openImagesModal: () => void;
    setIsPreviewOpen: (value: boolean) => void;
    setPreviewImage: (image: ImageObject | null) => void;
}

const EditPostForm: React.FC<Props> = ({openImagesModal, setPreviewImage, setIsPreviewOpen}) => {
    const {
        detailPost,
        updateLoading,
        setUpdateLoading,
    } = useSuperAdminPostStore();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: {errors, isDirty}
    } = useForm<UpdatePostFormData>({
        resolver: zodResolver(updatePostSchema),
    });

    const {fields, append, remove} = useFieldArray({control, name: 'images'});

    const router = useRouter();

    const [expanded, setExpanded] = useState(false);
    const [replaceAllImages, setReplaceAllImages] = useState(false);
    const [confirmType, setConfirmType] = useState<"replace" | "backToPage" | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const showImagePreview = (file: File, alt = {ru: ""}) => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({image: localUrl, alt});
        setIsPreviewOpen(true);
    };

    const descriptionValue = watch("description.ru");

    useEffect(() => {
        if (detailPost) reset({
            title: {ru: detailPost.title.ru},
            description: {ru: detailPost.description.ru},
            seoTitle: {ru: detailPost.seoTitle.ru},
            seoDescription: {ru: detailPost.seoDescription.ru},
        });
    }, [detailPost, reset]);

    if (!detailPost) return;

    const onCancelReplace = () => {
        setReplaceAllImages(false);
        reset({
            title: {ru: detailPost.title.ru},
            description: {ru: detailPost.description.ru},
        });
    };

    const requestConfirmation = (type: "replace" | "backToPage") => {
        setConfirmType(type);
        setShowConfirm(true);
    };

    const confirmActions = () => {
        if (confirmType === "replace") {
            setReplaceAllImages(true);
            remove();
            append({alt: {ru: ""}, file: null});
        } else if (confirmType === "backToPage") {
            router.push('/admin/blog');
        }
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(`images.${index}.file`, file, {shouldValidate: true});
    };

    const handleAltChange = (index: number, value: string) => {
        setValue(`images.${index}.alt.ru`, value, {shouldValidate: true});
    };

    const onSubmit = async (data: UpdatePostFormData) => {
        try {
            setUpdateLoading(true);

            if (replaceAllImages) {
                await updatePost(detailPost._id, data, "replace");
            } else {
                await updatePost(detailPost._id, data, "append");
            }
            toast.success('Пост успешно обновлен');
            router.push('/admin/blog');
        } catch (error) {
            const message = await handleKyError(error, "Ошибка при редактировании поста");
            toast.error(message);
        } finally {
            setUpdateLoading(false);
        }
    };

    const confirmTitle =
        confirmType === "backToPage"
            ? "Покинуть страницу?"
            : "Заменить изображения?";

    const confirmDescription =
        confirmType === "replace"
            ? "При этом действии ВСЕ предыдущие изображения безвозвратно будут заменены. Чтобы просмотреть или редактировать нажмите на кнопку 'Просмотреть старые изображения'"
            : "Если покинете страницу то введённые данные будут потеряны";


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-b-gray-500 py-3 mb-4">
                    <Label className="mb-2 block">Заголовок поста</Label>
                    <Input
                        type="text"
                        placeholder="Введите цепляющий заголовок"
                        {...register('title.ru')}
                        disabled={updateLoading}
                        className="mb-2"
                    />
                    {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}

                    <Label className="mb-2 block">SEO заголовок</Label>
                    <Input
                        type="text"
                        placeholder="SEO заголовок"
                        disabled={updateLoading}
                        {...register('seoTitle.ru')}
                        className="mb-2"
                    />

                    {errors.seoTitle && <FormErrorMessage>{errors.seoTitle.message}</FormErrorMessage>}

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Описание</label>
                        <FroalaEditorWrapper
                            key={detailPost?._id ?? 'editor'}
                            model={descriptionValue ?? detailPost?.description?.ru ?? ''}
                            onChangeAction={(value: string) => setValue('description.ru', value, { shouldValidate: true })}
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
                    {errors.seoDescription && <FormErrorMessage>{errors.seoDescription.message}</FormErrorMessage>}
                </div>

                <div className="w-full max-w-4xl mb-3">
                    <label className="block mb-4">Изображения:</label>

                    <div className="flex flex-wrap gap-2 md:gap-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (fields.length < 3) {
                                    append({ alt: { ru: "" }, file: null });
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
                        className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${expanded ? 'max-h-none overflow-visible' : 'max-h-[350px] overflow-y-auto'}`}>
                        {fields.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-4 space-y-6 bg-white shadow-sm">
                                <Label className="w-full mb-2">Альтернативное название изображения</Label>
                                <Input
                                    type="text"
                                    placeholder="Опишите, что изображено на фото (для доступности и поиска)"
                                    {...register(`images.${index}.alt.ru`)}
                                    disabled={updateLoading}
                                    onChange={(e) => handleAltChange(index, e.target.value)}
                                />
                                {errors.images?.[index]?.alt && (
                                    <FormErrorMessage>{errors.images[index]?.alt?.message}</FormErrorMessage>
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
                </div>

                <div className="flex flex-wrap gap-1 md:gap-5">
                    <Button
                        type="submit"
                        className="mt-6 px-6"
                        disabled={updateLoading || !isDirty}
                    >
                        {updateLoading && <LoaderIcon/>}
                        Сохранить изменения
                    </Button>

                    <Button
                        type="button"
                        className="mt-6 px-6"
                        disabled={updateLoading}
                        variant="outline"
                        onClick={() => requestConfirmation("backToPage")}
                    >
                        Отмена
                    </Button>

                </div>
            </form>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={confirmTitle}
                text={confirmDescription}
                onConfirm={() => {
                    confirmActions();
                    setShowConfirm(false);
                    setConfirmType(null);
                }}
                loading={updateLoading}
            />
        </>
    );
};

export default EditPostForm;