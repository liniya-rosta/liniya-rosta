'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { fetchPortfolioItem } from '@/actions/portfolios';
import { deleteGalleryItem } from '@/actions/superadmin/portfolios';
import { useSuperAdminPortfolioStore } from '@/store/superadmin/superAdminPortfolio';
import LoadingFullScreen from '@/src/components/ui/Loading/LoadingFullScreen';
import ErrorMsg from '@/src/components/ui/ErrorMsg';
import { handleKyError } from '@/src/lib/handleKyError';
import { CustomContainer } from '@/src/components/shared/CustomContainer';
import EditPortfolioForm from '@/src/app/(admin)/admin/portfolio/portfolio-form/components/EditPortfolioForm/EditPortfolioForm';
import ImageViewerModal from '@/src/components/shared/ImageViewerModal';
import ModalGallery from '@/src/components/shared/ModalGallery';
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';
import { ImageObject } from '@/src/lib/types';
import { GalleryEditForm, ModalEdit } from '@/src/app/(admin)/admin/portfolio/components/ModelEdit';

const EditPortfolioPage = () => {
    const params = useParams();
    const id = params?.id;

    const {
        fetchPortfolioLoading,
        detailItem,
        selectedToDelete,
        setSelectedToDelete,
        deleteLoading,
        setPortfolioItemDetail,
        setPortfolioFetchLoading,
    } = useSuperAdminPortfolioStore();

    const [fetchError, setFetchError] = useState<string | null>(null);

    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [imageEditSelectionMode, setImageEditSelectionMode] = useState(false);
    const [isImageModalEdit, setIsImageModalEdit] = useState(false);

    const [previewImage, setPreviewImage] = useState<ImageObject | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const fetchOnePortfolio = useCallback(async () => {
        setPortfolioFetchLoading(true);
        try {
            if (id && typeof id === "string") {
                const res = await fetchPortfolioItem(id);
                setPortfolioItemDetail(res);
            }
        } catch (error) {
            const msg = await handleKyError(error, 'Ошибка при получении портфолио');
            setFetchError(msg);
        } finally {
            setPortfolioFetchLoading(false);
        }
    }, [id, setPortfolioItemDetail, setPortfolioFetchLoading]);

    useEffect(() => {
        void fetchOnePortfolio();
    }, [fetchOnePortfolio]);

    const openEditModalGalleryItem = (id: string) => {
        const item = detailItem?.gallery.find(img => img._id === id);
        if (item) {
            useSuperAdminPortfolioStore.getState().setGalleryItem(item);
            setIsImageModalEdit(true);
        }
    };

    const handleDeleteImages = async () => {
        if (!selectedToDelete.length) return;
        try {
            setPortfolioFetchLoading(true);
            await Promise.all(selectedToDelete.map(id => deleteGalleryItem(id)));

            if (detailItem) {
                const updated = await fetchPortfolioItem(detailItem._id);
                setPortfolioItemDetail(updated);
            }

            toast.success(`Удалено ${selectedToDelete.length} изображений`);
        } catch (error) {
            const msg = await handleKyError(error, 'Ошибка при удалении изображения');
            toast.error(msg);
        } finally {
            setSelectedToDelete([]);
            setShowConfirm(false);
        }
    };

    if (fetchPortfolioLoading) return <LoadingFullScreen />;
    if (fetchError) return <ErrorMsg error={fetchError} />;

    return (
        <CustomContainer>
            <div className="my-15">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Редактировать Портфолио</h2>
                    <main className="max-w-4xl mx-auto">
                        <EditPortfolioForm
                            openImagesModal={() => setIsImagesModalOpen(true)}
                            setIsPreviewOpen={setIsPreviewOpen}
                            setPreviewImage={setPreviewImage}
                        />
                    </main>
                </div>
            </div>

            {previewImage && (
                <ImageViewerModal
                    open={isPreviewOpen}
                    openChange={() => setIsPreviewOpen(false)}
                    alt={previewImage.alt}
                    image={previewImage.image}
                />
            )}

            {detailItem && (
                <ModalGallery
                    open={isImagesModalOpen}
                    openChange={() => setIsImagesModalOpen(false)}
                    items={detailItem.gallery}
                    keyBy="id"
                    selectedKeys={selectedToDelete}
                    setSelectedKeys={setSelectedToDelete}
                    selectionMode={imageEditSelectionMode}
                    setSelectionMode={setImageEditSelectionMode}
                    isOpenModalEdit={openEditModalGalleryItem}
                    onRequestDelete={() => {
                        setShowConfirm(true);
                        setIsImageDelete(true);
                    }}
                    deleteLoading={deleteLoading}
                />
            )}

            <ModalEdit
                open={isImageModalEdit}
                openChange={() => setIsImageModalEdit(false)}
            >
                <GalleryEditForm
                    onSaved={() => setIsImageModalEdit(false)}
                />
            </ModalEdit>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={'Удалить изображение?'}
                onConfirm={handleDeleteImages}
                loading={deleteLoading}
                text="Это действие невозможно отменить. Элемент будет удален навсегда."
            />
        </CustomContainer>
    );
};

export default EditPortfolioPage;