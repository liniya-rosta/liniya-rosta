'use client'

import React, {useEffect, useState} from 'react';
import EditPostForm from "@/src/app/(admin)/admin/blog/post-form/components/EditPostForm/EditPostForm";
import {useParams} from 'next/navigation';
import {usePostsFetcher} from "@/src/app/(admin)/admin/blog/hooks/usePostsFetcher";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import ModalGallery from "@/src/components/shared/ModalGallery";
import {ImageObject} from "@/src/lib/types";
import {usePostDeletion} from "@/src/app/(admin)/admin/blog/hooks/usePostDeletion";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ImageEditForm from "@/src/app/(admin)/admin/blog/components/ImageEditForm";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";
import ErrorMsg from "@/src/components/ui/ErrorMsg";

const Page = () => {
    const params = useParams();
    const id = params?.id;

    const [showConfirm, setShowConfirm] = useState(false);

    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [imageEditSelectionMode, setImageEditSelectionMode] = useState(false);

    const [isImageModalEdit, setIsImageModalEdit] = useState(false);
    const [selectImageEdit, setSelectImageEdit] = useState<string>("");

    const [previewImage, setPreviewImage] = useState<ImageObject | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const {
        fetchOnePost,
        pagination,
    } = usePostsFetcher();

    const {
        isImageDelete,
        handleDelete,
        multipleDeletion,
        setImageDelete,
    } = usePostDeletion({fetchOnePost, pagination});

    const {
        detailPost,
        fetchLoading,
        fetchError,
        selectedToDelete,
        deleteLoading,
        setSelectedToDelete,
        setFetchLoading,
    } = useSuperAdminPostStore();

    useEffect(() => {
        setFetchLoading(true);
        if (id && typeof id === "string") {
            void fetchOnePost(id)
        }
    }, [id]);

    if (fetchLoading) return <LoadingFullScreen/>;
    if (fetchError) return <ErrorMsg error={fetchError}/>

    return (
        <div className="container mx-auto px-8">

            <div className="my-15">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Редактировать Пост</h2>
                    <main className="max-w-4xl mx-auto">
                        <EditPostForm
                            openImagesModal={() => setIsImagesModalOpen(true)}
                            setIsPreviewOpen={setIsPreviewOpen}
                            setPreviewImage={setPreviewImage}
                        />
                    </main>
                </div>
            </div>

            <ImageEditForm
                open={isImageModalEdit}
                imageUrl={selectImageEdit}
                openChange={() => setIsImageModalEdit(false)}
                onSaved={() => setIsImageModalEdit(false)}
                setIsPreviewOpen={setIsPreviewOpen}
                setPreviewImage={setPreviewImage}
            />

            {previewImage && (
                <ImageViewerModal
                    open={isPreviewOpen}
                    openChange={() => setIsPreviewOpen(false)}
                    alt={previewImage.alt?.ru}
                    image={previewImage.image}
                />
            )}

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={isImageDelete ? "Удалить изображение?" : "Удалить пост(ы)?"}
                onConfirm={async () => {
                    if (selectedToDelete.length > 1) {
                        await multipleDeletion();
                    } else if (selectedToDelete.length === 1) {
                        await handleDelete();
                    }
                }}
                loading={deleteLoading}
            />

            {detailPost && (
                <ModalGallery
                    open={isImagesModalOpen}
                    openChange={() => setIsImagesModalOpen(false)}
                    items={detailPost.images}
                    keyBy="image"
                    selectedKeys={selectedToDelete}
                    setSelectedKeys={setSelectedToDelete}
                    selectionMode={imageEditSelectionMode}
                    setSelectionMode={setImageEditSelectionMode}
                    isOpenModalEdit={(key) => {
                        setIsImageModalEdit(true)
                        setSelectImageEdit(key)
                    }}
                    onRequestDelete={()=> {
                        setShowConfirm(true);
                        setImageDelete(true);
                    }}
                    deleteLoading={deleteLoading}
                />
            )}
        </div>

    );
};

export default Page;