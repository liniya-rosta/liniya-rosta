'use client'

import React, {useEffect, useState} from "react";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import {PortfolioItemPreview} from "@/lib/types";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {fetchGalleryItem, fetchPortfolioItem, fetchPortfolioPreviews} from "@/actions/portfolios";
import {deleteGalleryItem, deletePortfolio } from "@/actions/superadmin/portfolios";
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
import {CustomTable, getColumns, CustomTableHeader, TablePagination} from "@/app/(admin)/admin/portfolio/components/DataTable";
import ModalCover from "@/app/(admin)/admin/portfolio/components/ModalCover";
import {ModalEdit, PortfolioEditForm, GalleryEditForm} from "@/app/(admin)/admin/portfolio/components/ModelEdit";
import ModalGallery from "@/app/(admin)/admin/portfolio/components/ModalGallery";
import DataSkeleton from "@/components/shared/Loading/DataSkeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

interface Props {
    data: PortfolioItemPreview[] | null;
    error?: string | null;
}

const AdminPortfolioClient: React.FC<Props> = ({data, error}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [isModalOpenCover, setIsModalOpenCover] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpenGallery, setIsModalOpenGallery] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [selectedCover, setSelectedCover] = useState<{ cover: string; alt?: string } | null>(null);
    const [isGalleryEdit, setIsGalleryEditing] = useState<boolean>(false);
    const [isGalleryDelete, setGalleryDelete] = useState<boolean>(false);


    const {
        items,
        detailItem,
        selectedToDelete,
        fetchPortfolioLoading,
        deleteLoading,
        setPortfolioItemDetail,
        setGalleryItem,
        setSelectedToDelete,
        setPortfolioPreview,
        setPortfolioFetchLoading,
        setPortfolioDeleteLoading,
    } = useSuperAdminPortfolioStore();

    useEffect(() => {
        if(data) setPortfolioPreview(data);
        setPortfolioFetchLoading(false);
    }, [data, setPortfolioPreview, setPortfolioFetchLoading]);

    const handleDelete = async (id: string, isGallery: boolean) => {
        try {
            setShowConfirm(false);
            setPortfolioDeleteLoading(true);

            if (isGallery) {
                await deleteGalleryItem(id);
                if (detailItem) {
                    const updated = await fetchPortfolioItem(detailItem._id);
                    setPortfolioItemDetail(updated);
                }
            } else {
                await deletePortfolio(id);
                const updated = await fetchPortfolioPreviews();
                setPortfolioPreview(updated);
            }

            toast.success(isGallery ? "Элемент галереи удален" : "Портфолио удалено");
        } catch (error) {
            let errorMessage = "Ошибка при удалении";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setPortfolioDeleteLoading(false);
            setSelectedToDelete([]);
        }
    };

    const openEditModalCover = async (id: string) => {
       try {
           const portfolioItem = await fetchPortfolioItem(id);
           setIsEditModalOpen(true);
           setIsGalleryEditing(false);
           setPortfolioItemDetail(portfolioItem);
       } catch (error) {
           let errorMessage = "Ошибка при получении данных";
           if (isAxiosError(error) && error.response) {
               errorMessage = error.response.data.error;
           } else if (error instanceof Error) {
               errorMessage = error.message;
           }

           toast.error(errorMessage);
       }
    };

    const openGalleryModal = async (id: string) => {
        try {
            const portfolioItem = await fetchPortfolioItem(id);
            setIsModalOpenGallery(true);
            setPortfolioItemDetail(portfolioItem);
        } catch (error) {
            let errorMessage = "Ошибка при получении данных";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    }
    const openEditModalGalleryItem = async (id: string) => {
       try {
           const galleryItem = await fetchGalleryItem(id)
           setGalleryItem(galleryItem);
           setIsGalleryEditing(true);
           setIsEditModalOpen(true);
       } catch (error) {
           let errorMessage = "Ошибка при получении данных";
           if (isAxiosError(error) && error.response) {
               errorMessage = error.response.data.error;
           } else if (error instanceof Error) {
               errorMessage = error.message;
           }

           toast.error(errorMessage);
       }
    };

    const table = useReactTable<PortfolioItemPreview>({
        data: items,
        columns: getColumns(
            (image) => {
                setSelectedCover(image);
                setIsModalOpenCover(true);
            },
            (id) => {
                setSelectedToDelete([id]);
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

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedToDelete(selectedRows.map(row => row.original._id));
    }, [rowSelection]);

    const multipleDeletion = async () => {
       try {
           setShowConfirm(false);
           setPortfolioDeleteLoading(true);

           if (!isGalleryDelete) {
               await Promise.all(
                   selectedToDelete.map((id) => deletePortfolio(id))
               );
               const updated = await fetchPortfolioPreviews();
               setPortfolioPreview(updated);
           } else {
               await Promise.all(
                   selectedToDelete.map((id) => deleteGalleryItem(id))
               );
               if (detailItem) {
                   const updated = await fetchPortfolioItem(detailItem._id);
                   setPortfolioItemDetail(updated);
               }
           }

           toast.success(`Удалено ${selectedToDelete.length}`);

       } catch (error) {
           let errorMessage = "Ошибка при удалении";
           if (isAxiosError(error) && error.response) {
               errorMessage = error.response.data.error;
           } else if (error instanceof Error) {
               errorMessage = error.message;
           }

           toast.error(errorMessage);
       } finally {
           setPortfolioDeleteLoading(false);
           setSelectedToDelete([]);
       }
    }

    if (fetchPortfolioLoading) return <DataSkeleton/>

    if (error) {
        return (
            <div className="text-center py-10 text-destructive text-lg">
                <p>Ошибка загрузки: {error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground text-center sm:text-left">
                        Управление портфолио
                    </h1>
                    <p className="text-muted-foreground mt-1 text-center sm:text-left">
                        Создавайте и редактируйте портфолио
                    </p>
                </div>
                <Link href="/admin/portfolio/add-portfolio" >
                    <Button className="flex items-center gap-2 w-full sm:w-auto">
                        Создать портфолио
                        <Plus size={16} />
                    </Button>
                </Link>
            </div>

           <CustomTableHeader
               table={table}
               showConfirm={setShowConfirm}
               setGalleryDelete={setGalleryDelete}
           />
            <div className="rounded-md border">
                <CustomTable table={table}/>
            </div>
            <TablePagination table={table}/>

            {selectedCover &&
                <ModalCover
                    open={isModalOpenCover}
                    openChange={() => setIsModalOpenCover(!isModalOpenCover)}
                    alt={selectedCover.alt || "Изображение портфолио"}
                    image={selectedCover.cover}
                />
            }

            <ModalEdit
                open={isEditModalOpen}
                openChange={() => setIsEditModalOpen(!isEditModalOpen)}>
                {isGalleryEdit ?
                    <GalleryEditForm onSaved={()=> setIsEditModalOpen(!isEditModalOpen)}/>
                    : <PortfolioEditForm onSaved={()=> setIsEditModalOpen(!isEditModalOpen)}/>
                }
            </ModalEdit>

            <ModalGallery
                open={isModalOpenGallery}
                openChange={() => setIsModalOpenGallery(!isModalOpenGallery)}
                isOpenModalEdit={openEditModalGalleryItem}
                onRequestDelete={() => {
                    setGalleryDelete(true);
                    setShowConfirm(true);
                }}
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={
                    selectedToDelete.length > 1
                        ? "Удалить выбранные элементы?"
                        : "Удалить элемент?"
                }
                onConfirm={ async () => {
                    if (selectedToDelete.length > 1) {
                        await multipleDeletion();
                    } else if (selectedToDelete.length === 1) {
                        await handleDelete(selectedToDelete[0], isGalleryDelete);
                    }
                }}
                loading={deleteLoading}
            />
        </>
    )
}

export default AdminPortfolioClient;