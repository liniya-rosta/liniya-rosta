import React, {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import FormErrorMessage from '@/components/ui/FormErrorMessage';
import LoaderIcon from '@/components/ui/Loading/LoaderIcon';
import {Eye, Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {isAxiosError} from 'axios';
import {toast} from 'react-toastify';
import {updatePost} from '@/actions/superadmin/posts';
import {UpdatePostFormData, updatePostSchema} from '@/lib/zodSchemas/postSchema';
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {ImageObject} from "@/lib/types";

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

    const showImagePreview = (file: File, alt = "") => {
        const localUrl = URL.createObjectURL(file);
        setPreviewImage({image: localUrl, alt});
        setIsPreviewOpen(true);
    };

    useEffect(() => {
        if (detailPost) reset({
            title: detailPost.title,
            description: detailPost.description,
        });
    }, [detailPost]);

    if (!detailPost) return;

    const onCancelReplace = () => {
        setReplaceAllImages(false);
        reset({
            title: detailPost.title,
            description: detailPost.description,
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
            append({alt: '', file: null});
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
        setValue(`images.${index}.alt`, value, {shouldValidate: true});
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
            let message = 'Ошибка при обновлении поста';
            if (isAxiosError(error) && error.response) {
                message = error.response.data.error;
            }
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
                    <Input
                        type="text"
                        placeholder="Заголовок"
                        {...register('title')}
                        disabled={updateLoading}
                        className="mb-2"
                    />
                    {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}

                    <Input
                        type="text"
                        placeholder="Описание"
                        {...register('description')}
                        disabled={updateLoading}
                        className="mb-4"
                    />
                    {errors.description && <FormErrorMessage>{errors.description.message}</FormErrorMessage>}
                </div>

                <div className="w-full max-w-4xl mb-3">
                    <label className="block mb-4">Изображения:</label>

                    <div className="flex gap-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({alt: '', file: null})}
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
                            disabled={updateLoading || fields.length === 0}
                        >
                            {expanded ? 'Свернуть' : 'Развернуть все'}
                        </Button>
                    </div>
                    {errors.images?.message && (
                        <FormErrorMessage>{errors.images.message}</FormErrorMessage>
                    )}

                    <div
                        className={`grid grid-cols-2 gap-3 transition-all duration-300 ${expanded ? 'max-h-none overflow-visible' : 'max-h-[350px] overflow-y-auto'}`}>
                        {fields.map((item, index) => (
                            <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                                <Input
                                    type="text"
                                    placeholder="Alt"
                                    {...register(`images.${index}.alt`)}
                                    disabled={updateLoading}
                                    onChange={(e) => handleAltChange(index, e.target.value)}
                                />
                                {errors.images?.[index]?.alt && (
                                    <FormErrorMessage>{errors.images[index]?.alt?.message}</FormErrorMessage>
                                )}

                                <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={updateLoading}
                                    onChange={(e) => handleImageChange(index, e)}
                                />
                                {errors.images?.[index]?.file && (
                                    <FormErrorMessage>{errors.images[index]?.file?.message}</FormErrorMessage>
                                )}

                                <div className="flex items-center justify-between">
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
                                        <Eye className="w-4 h-4"/> Посмотреть изображение
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

                <div className="flex gap-5">
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
                description={confirmDescription}
                onConfirm={() => {
                    confirmActions();
                    setShowConfirm(false);
                }}
                loading={updateLoading}
            />
        </>
    );
};

export default EditPostForm;