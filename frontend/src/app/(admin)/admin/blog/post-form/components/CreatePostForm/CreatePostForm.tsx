import React, {useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createPost} from '@/actions/superadmin/posts';
import {Button} from '@/src/components/ui/button';
import LoaderIcon from '@/src/components/ui/Loading/LoaderIcon';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {CreatePostFormData, createPostSchema} from "@/src/lib/zodSchemas/admin/postSchema";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import Link from "next/link";
import {ImageObject} from "@/src/lib/types";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {handleKyError} from "@/src/lib/handleKyError";
import PostBasicInfo from './PostBasicInfo';
import ImagesSection from "@/src/app/(admin)/admin/blog/post-form/components/CreatePostForm/ImagesSection";

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
        watch,
        formState: {errors, isDirty}
    } = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
    });

    const {paginationPost} = useSuperAdminPostStore();
    const descriptionValue = watch("description.ru");

    const {fields, append, remove} = useFieldArray({control, name: 'images'});
    const router = useRouter();

    const {createLoading, setCreateLoading} = useSuperAdminPostStore();
    const [expanded, setExpanded] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const showImagePreview = (file: File, alt = {ru: ""}) => {
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
            const message = await handleKyError(error, "Ошибка при создании поста");
            toast.error(message);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PostBasicInfo
                    register={register}
                    errors={errors}
                    control={control}
                    setValue={setValue}
                    createLoading={createLoading}
                    descriptionValue={descriptionValue}
                />

                <ImagesSection
                    fields={fields}
                    append={append}
                    remove={remove}
                    register={register}
                    control={control}
                    errors={errors}
                    createLoading={createLoading}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    showImagePreview={showImagePreview}
                    handleAltChange={handleAltChange}
                    handleImageChange={handleImageChange}
                />

                <div className="flex flex-wrap gap-1 md:gap-5">
                    <Button type="submit" disabled={createLoading || !isDirty}>
                        {createLoading && <LoaderIcon />}
                        Создать пост
                    </Button>
                    <Link href={paginationPost ? `/admin/blog?page=${paginationPost.page}` : "/admin/blog"}>
                        <Button variant="outline" disabled={createLoading}>Отмена</Button>
                    </Link>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Покинуть страницу?"
                text="Если покинете страницу то введённые данные будут потеряны"
                onConfirm={() => setShowConfirm(false)}
                loading={createLoading}
            />
        </>
    );
};

export default CreatePostForm;