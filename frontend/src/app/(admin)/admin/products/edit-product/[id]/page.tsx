"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import ProductEditForm from "@/src/app/(admin)/admin/products/edit-product/components/productEditForm";
import {ImageObject} from "@/src/lib/types";
import ImageEditForm from "@/src/app/(admin)/admin/blog/components/ImageEditForm";
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ModalGallery from "@/src/components/shared/ModalGallery";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {useProductFetcher} from "@/src/app/(admin)/admin/products/hooks/useProductFetcher";
import {useProductDeletion} from "@/src/app/(admin)/admin/products/hooks/useProductDeletion";

const ProductEdit = () => {
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
        fetchOneProduct,
        pagination,
    } = useProductFetcher();

    const {
        isImageDelete,
        handleDelete,
        multipleDeletion,
        setImageDelete,
    } = useProductDeletion({fetchOneProduct, pagination});

    const {
        productDetail,
        fetchLoading,
        fetchError,
        selectedToDelete,
        deleteLoading,
        setSelectedToDelete,
        setFetchLoading,
    } = useAdminProductStore();


    useEffect(() => {
        if (id && typeof id === "string") {
            void fetchOneProduct(id)
        }
    }, [id]);

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="my-15">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Редактировать Товар</h2>
                    <main className="max-w-4xl mx-auto">
                        <ProductEditForm setIsPreviewOpen={setIsPreviewOpen} setPreviewImage={setPreviewImage} openImagesModal={openImagesGallery} />
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

            {productDetail && (
                <ModalGallery
                    open={isImagesModalOpen}
                    openChange={() => setIsImagesModalOpen(false)}
                    items={productDetail.images}
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

export default ProductEdit;