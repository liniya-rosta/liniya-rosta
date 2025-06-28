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
import ImageModal from "@/app/(admin)/admin/portfolio/components/ImageModal";
import {ModalEdit, PortfolioEditForm, GalleryEditForm} from "@/app/(admin)/admin/portfolio/components/ModelEdit";
import ModalGallery from "@/app/(admin)/admin/portfolio/components/ModalGallery";
import DataSkeleton from "@/components/ui/Loading/DataSkeleton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import ErrorMsg from "@/components/ui/ErrorMsg";

interface Props {
    error?: string | null;
    limit?: string;
}

const AdminPortfolioClient: React.FC<Props> = ({ error, limit = "10"}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: Number(limit),
    });

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
        paginationPortfolio,
        setPortfolioItemDetail,
        setGalleryItem,
        setSelectedToDelete,
        setPortfolioPreview,
        setPortfolioFetchLoading,
        setPortfolioDeleteLoading,
        setPaginationPortfolio,
    } = useSuperAdminPortfolioStore();

     const updatePaginationAndData = async (searchValue = "", searchField = "coverAlt") => {
       try {
           setPortfolioFetchLoading(true);
           const filters = {
               coverAlt: "",
               description: "",
           };
           if (searchField === "coverAlt") filters.coverAlt = searchValue;
           if (searchField === "description") filters.description = searchValue;

           const data = await fetchPortfolioPreviews(
               pagination.pageSize.toString(),
               (pagination.pageIndex + 1).toString(),
               filters.coverAlt,
               filters.description
           );
           setPortfolioPreview(data.items);
           setPaginationPortfolio({
               total: data.total,
               page: data.page,
               totalPages: data.totalPages,
               pageSize: data.pageSize,
           });
           return data.items.length;
       } catch (error) {
           let errorMessage = "Ошибка при получении данных";
           if (isAxiosError(error) && error.response) {
               errorMessage = error.response.data.error;
           } else if (error instanceof Error) {
               errorMessage = error.message;
           }

           toast.error(errorMessage);
       } finally {
           setPortfolioFetchLoading(false)
       }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPortfolioFetchLoading(true);
                await updatePaginationAndData();
            } catch (error) {
                let errorMessage = "Ошибка при получении данных";
                if (isAxiosError(error) && error.response) {
                    errorMessage = error.response.data.error;
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                toast.error(errorMessage);
            } finally {
                setPortfolioFetchLoading(false);
            }
        };

        void fetchData();
    }, [pagination]);

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedToDelete(selectedRows.map(row => row.original._id));
    }, [rowSelection]);

    useEffect(() => {
        setRowSelection({});
    }, [pagination.pageIndex]);

    const handleDelete = async (id: string, isGallery: boolean) => {
        try {
            setShowConfirm(false);
            setPortfolioDeleteLoading(true);

            const isLastItem = items.length === 1 && pagination.pageIndex > 0;

            if (isGallery) {
                await deleteGalleryItem(id);
                if (detailItem) {
                    const updated = await fetchPortfolioItem(detailItem._id);
                    setPortfolioItemDetail(updated);
                }
            } else {
                await deletePortfolio(id);
                if (isLastItem) {
                    setPagination((prev) => ({
                        ...prev,
                        pageIndex: prev.pageIndex - 1,
                    }));
                } else {
                    await updatePaginationAndData();
                }
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
        pageCount: paginationPortfolio?.totalPages ?? 1,
        manualPagination: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    const multipleDeletion = async () => {
       try {
           setShowConfirm(false);
           setPortfolioDeleteLoading(true);
           if (!isGalleryDelete) {
               const isLastPage = items.length === selectedToDelete.length && pagination.pageIndex > 0;

               await Promise.all(
                   selectedToDelete.map((id) => deletePortfolio(id))
               );

               if (isLastPage) {
                   setPagination((prev) => ({
                       ...prev,
                       pageIndex: prev.pageIndex - 1,
                   }));
                   setRowSelection({});
               } else {
                   await updatePaginationAndData();
                   setRowSelection({});
               }

           } else {
               await Promise.all(
                   selectedToDelete.map((id) => deleteGalleryItem(id))
               );
               if (detailItem) {
                   const updated = await fetchPortfolioItem(detailItem._id);
                   setPortfolioItemDetail(updated);
               }
           }

           toast.success(`Удалено ${selectedToDelete.length} элемента`);

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
           setRowSelection({});
       }
    }

    const handleFilterChange = (column: string, value: string) => {
        void updatePaginationAndData(value, column);
    };


    if (fetchPortfolioLoading) return <DataSkeleton/>
    if (error) return <ErrorMsg error={error}/>

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
                        <Plus size={16} />
                        Создать портфолио
                    </Button>
                </Link>
            </div>

           <CustomTableHeader
               table={table}
               showConfirm={setShowConfirm}
               setGalleryDelete={setGalleryDelete}
               onFilterChange={handleFilterChange}
           />
            <div className="rounded-md border">
                <CustomTable table={table}/>
            </div>
            <TablePagination table={table}/>

            {selectedCover &&
                <ImageModal
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
                    : <PortfolioEditForm
                        updatePaginationAndData={updatePaginationAndData}
                        onSaved={()=> setIsEditModalOpen(!isEditModalOpen)}
                    />
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