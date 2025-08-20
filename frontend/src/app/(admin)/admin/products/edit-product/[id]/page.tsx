"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import ProductEditForm from "@/src/app/(admin)/admin/products/edit-product/components/productEditForm";
import { ImageObject} from "@/src/lib/types";
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
import {useProductFetcher} from "@/src/app/(admin)/admin/products/hooks/useProductFetcher";
import {useProductDeletion} from "@/src/app/(admin)/admin/products/hooks/useProductDeletion";
import ImagesModal from "@/src/app/(admin)/admin/products/components/Modal/ImagesModal";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/src/components/ui/ErrorMsg";

const ProductEdit = () => {
    const params = useParams();
    const id = params?.id;

    const [showConfirm, setShowConfirm] = useState(false);

    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);

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
    } = useProductDeletion({fetchOneProduct, pagination});

    const {
        productDetail,
        fetchLoading,
        fetchError,
        selectedToDelete,
        deleteLoading,
        setFetchLoading,
    } = useAdminProductStore();


    useEffect(() => {
        setFetchLoading(true);
        if (id && typeof id === "string") {
            void fetchOneProduct(id);
        }
    }, [id])

    if (fetchLoading) return <LoadingFullScreen/>;
    if (fetchError) return <ErrorMsg error={fetchError}/>

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="my-15">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Редактировать Товар</h2>
                    <main className="max-w-4xl mx-auto">
                        <ProductEditForm openImagesModal={() => setIsImagesModalOpen(true)}
                                         setIsPreviewOpen={setIsPreviewOpen}
                                         setPreviewImage={setPreviewImage} />
                    </main>
                </div>
            </div>

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
                <ImagesModal
                    open={isImagesModalOpen}
                    onClose={() => setIsImagesModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProductEdit;