import React, {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';

import {UpdatePostFormData, updatePostSchema} from '@/src/lib/zodSchemas/admin/postSchema';
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {updatePost} from '@/actions/superadmin/posts';
import {handleKyError} from "@/src/lib/handleKyError";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import PostBasicInfo from './PostBasicInfo';
import ImagesSection from './ImagesSection';
import LoaderIcon from '@/src/components/ui/Loading/LoaderIcon';
import {ImageObject} from "@/src/lib/types";
import {Button} from "@/src/components/ui/button";

interface Props {
    openImagesModal: () => void;
    setIsPreviewOpen: (value: boolean) => void;
    setPreviewImage: (image: ImageObject | null) => void;
}

const EditPostForm: React.FC<Props> = ({openImagesModal, setPreviewImage, setIsPreviewOpen}) => {
    const {detailPost, updateLoading, setUpdateLoading} = useSuperAdminPostStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: {errors, isDirty}
    } = useForm<UpdatePostFormData>({resolver: zodResolver(updatePostSchema)});
    const {fields, append, remove} = useFieldArray({control, name: 'images'});

    const {paginationPost} = useSuperAdminPostStore();

    const [expanded, setExpanded] = useState(false);
    const [replaceAllImages, setReplaceAllImages] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const descriptionValue = watch("description.ru");

    useEffect(() => {
        if (detailPost) reset({
            title: {ru: detailPost.title.ru},
            description: {ru: detailPost.description.ru},
            seoTitle: {ru: detailPost.seoTitle.ru},
            seoDescription: {ru: detailPost.seoDescription.ru},
        });
    }, [detailPost, reset]);

    if (!detailPost) return null;

    const onCancelReplace = () => {
        setReplaceAllImages(false);
        reset({
            title: {ru: detailPost.title.ru},
            description: {ru: detailPost.description.ru},
        });
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue(`images.${index}.file`, file, {shouldValidate: true});
    };

    const handleBackConfirm = () => {
        setShowConfirm(false);
        router.push(paginationPost ? `/admin/blog?page=${paginationPost.page}` : "/admin/blog");
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
            reset();
            router.push('/admin/blog');
        } catch (error) {
            const message = await handleKyError(error, "Ошибка при редактировании поста");
            toast.error(message);
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PostBasicInfo
                    register={register}
                    errors={errors}
                    descriptionValue={descriptionValue}
                    setValue={setValue}
                    updateLoading={updateLoading}
                    detailPost={detailPost}
                />

                <ImagesSection
                    fields={fields}
                    append={append}
                    remove={remove}
                    register={register}
                    control={control}
                    errors={errors}
                    updateLoading={updateLoading}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    replaceAllImages={replaceAllImages}
                    onCancelReplace={onCancelReplace}
                    openImagesModal={openImagesModal}
                    setPreviewImage={setPreviewImage}
                    setIsPreviewOpen={setIsPreviewOpen}
                    handleImageChange={handleImageChange}
                />

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
                        variant="outline"
                        className="mt-6 px-6"
                        disabled={updateLoading}
                        onClick={() => setShowConfirm(true)}
                    >
                        Отмена
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Покинуть страницу?"
                text="Если покинете страницу, введённые данные будут потеряны"
                onConfirm={handleBackConfirm}
                loading={updateLoading}
            />
        </>
    );
};

export default EditPostForm;