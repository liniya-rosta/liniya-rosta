'use client'

import {PortfolioItemPreview} from "@/lib/types";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import React, {useEffect, useState} from "react";
import {getColumns} from "@/app/(admin)/admin/portfolio/components/DataTable/Columns";
import CustomTable from "@/app/(admin)/admin/portfolio/components/DataTable/Table";
import ModalCover from "@/app/(admin)/admin/portfolio/components/ModalCover";
import CustomTableHeader from "@/app/(admin)/admin/portfolio/components/DataTable/TableHeader";
import CustomTableFooter from "@/app/(admin)/admin/portfolio/components/DataTable/TableFooter";
import {fetchGalleryItem, fetchPortfolioItem, fetchPortfolioPreviews} from "@/actions/portfolios";
import ModalEdit from "@/app/(admin)/admin/portfolio/components/ModelEdit/ModalEdit";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import ModalGallery from "@/app/(admin)/admin/portfolio/components/ModalGallery";
import {deleteGalleryItem, deletePortfolio } from "@/actions/superadmin/portfolios";
import DataSkeleton from "@/components/shared/DataSkeleton";
import PortfolioEditForm from "@/app/(admin)/admin/portfolio/components/ModelEdit/PortfolioEditForm";
import GalleryEditForm from "@/app/(admin)/admin/portfolio/components/ModelEdit/GalleryEditForm";
import {toast} from "react-toastify";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {isAxiosError} from "axios";

interface Props {
    data: PortfolioItemPreview[];
}

const AdminPortfolioClient: React.FC<Props> = ({data}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [isModalOpenCover, setIsModalOpenCover] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenGallery, setIsModalOpenGallery] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [selectedCover, setSelectedCover] = useState<{ cover: string; alt?: string } | null>(null);
    const [isGalleryEdit, setGalleryEdit] = useState<boolean>(false);
    const [isGalleryDelete, setGalleryDelete] = useState<boolean>(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);

    const {
        items,
        fetchPortfolioLoading,
        deleteLoading,
        setPortfolioItemDetail,
        setGallery,
        setGalleryItem,
        setPortfolioPreview,
        setPortfolioFetchLoading,
        setPortfolioDeleteLoading,
    } = useSuperAdminPortfolioStore();

    useEffect(() => {
        setPortfolioPreview(data);
        setPortfolioFetchLoading(false);
    }, [data, setPortfolioPreview, setPortfolioFetchLoading]);

    const onDeletePortfolio = async () => {
        if(!itemIdToDelete) return;

        try {
            setShowConfirm(false);
            setPortfolioDeleteLoading(true);
            await deletePortfolio(itemIdToDelete);
            const updated = await fetchPortfolioPreviews();
            setPortfolioPreview(updated);

            toast.success("Вы успешно удалили Портфолио", {
                autoClose: 3000,
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при удалении Портфолио";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                autoClose: 3000,
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setPortfolioDeleteLoading(false);
            setItemIdToDelete(null);
        }
    };

    const onDeleteGalleryItem = async () => {
        if(!itemIdToDelete) return;

        try {
            setShowConfirm(false);
            setPortfolioDeleteLoading(true);
            await deleteGalleryItem(itemIdToDelete);
            toast.success("Вы успешно удалили элемент галереи", {
                autoClose: 3000,
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            let errorMessage = "Неизвестная ошибка при удалении элемента галереи";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                autoClose: 3000,
                position: "top-center",
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setPortfolioDeleteLoading(false);
            setItemIdToDelete(null);
        }
    }

    const openEditModalCover = async (id: string) => {
        const portfolioItem = await fetchPortfolioItem(id);
        setIsModalOpenEdit(true);
        setGalleryEdit(false);
        setPortfolioItemDetail(portfolioItem)
    };

    const openGalleryModal = async (id: string) => {
        const portfolioItem = await fetchPortfolioItem(id);
        setIsModalOpenGallery(true);
        setGallery(portfolioItem.gallery);
        setPortfolioItemDetail(portfolioItem);
    }
    const openEditModalGalleryItem = async (id: string) => {
        const galleryItem = await fetchGalleryItem(id)
        setGalleryItem(galleryItem);
        setGalleryEdit(true);
        setIsModalOpenEdit(true);
    };

    const table = useReactTable<PortfolioItemPreview>({
        data: items,
        columns: getColumns(
            (image) => {
                setSelectedCover(image);
                setIsModalOpenCover(true);
            },
            (id) => {
                setItemIdToDelete(id);
                setGalleryDelete(false);
                setShowConfirm(true);
            },
            openEditModalCover,
            openGalleryModal,
        ),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    if (fetchPortfolioLoading) return <DataSkeleton/>

    return (
        <div>
           <CustomTableHeader table={table}/>

            <div className="rounded-md border">
                <CustomTable table={table}/>
            </div>

            <CustomTableFooter table={table}/>

            {selectedCover &&
                <ModalCover
                    open={isModalOpenCover}
                    openChange={() => setIsModalOpenCover(!isModalOpenCover)}
                    alt={selectedCover.alt || "Изображение портфолио"}
                    image={selectedCover.cover}
                />
            }

            <ModalEdit
                open={isModalOpenEdit}
                openChange={() => setIsModalOpenEdit(!isModalOpenEdit)}>
                {isGalleryEdit ?
                    <GalleryEditForm onSaved={()=> setIsModalOpenEdit(!isModalOpenEdit)}/>
                    : <PortfolioEditForm onSaved={()=> setIsModalOpenEdit(!isModalOpenEdit)}/>
                }
            </ModalEdit>

            <ModalGallery
                open={isModalOpenGallery}
                openChange={() => setIsModalOpenGallery(!isModalOpenGallery)}
                isOpenModalEdit={openEditModalGalleryItem}
                onRequestDelete={(id) => {
                    setItemIdToDelete(id);
                    setGalleryDelete(true);
                    setShowConfirm(true);
                }}
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Удалить элемент?"
                onConfirm={isGalleryDelete ? () => onDeleteGalleryItem() : onDeletePortfolio}
                loading={deleteLoading}
            />
        </div>
    )
}

export default AdminPortfolioClient;