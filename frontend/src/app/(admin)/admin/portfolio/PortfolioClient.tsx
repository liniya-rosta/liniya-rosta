'use client'

import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {PortfolioItemPreview} from "@/src/lib/types";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {fetchGalleryItem, fetchPortfolioItem, fetchPortfolioPreviews} from "@/actions/portfolios";
import {deleteGalleryItem, deletePortfolio} from "@/actions/superadmin/portfolios";
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
import {
    CustomTable,
    getColumns,
    TableControls,
    TablePagination
} from "@/src/app/(admin)/admin/portfolio/components/DataTable";
import ImageModal from "@/src/app/(admin)/admin/portfolio/components/ImageModal";
import {GalleryEditForm, ModalEdit, PortfolioEditForm} from "@/src/app/(admin)/admin/portfolio/components/ModelEdit";
import DataSkeleton from "@/src/components/shared/DataSkeleton";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {usePersistedPageSize} from "@/hooks/usePersistedPageSize";
import ModalGallery from "@/src/components/shared/ModalGallery";
import {handleKyError} from "@/src/lib/handleKyError";
import SaleLabelModal from "@/src/app/(admin)/admin/products/components/Modal/SaleLabelModal";

interface Props {
    error?: string | null;
}

const AdminPortfolioClient: React.FC<Props> = ({error}) => {
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
    const [galleryEditSelectionMode, setGalleryEditSelectionMode] = useState(false);

    const [pageSize, setPageSize] = usePersistedPageSize("admin_portfolio_table_size");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const [modalText, setModalText] = useState<string | null>(null);

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
            const msg = await handleKyError(error, "Ошибка при получении данных портфолио");
            toast.error(msg);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPortfolioFetchLoading(true);
                await updatePaginationAndData();
            } catch (error) {
                const msg = await handleKyError(error, "Ошибка при получении данных портфолио");
                toast.error(msg);
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
            const msg = await handleKyError(error, "Ошибка при удалении");
            toast.error(msg);
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
            const msg = await handleKyError(error, "Ошибка при получении данных портфолио");
            toast.error(msg);
        }
    };

    const openGalleryModal = async (id: string) => {
        try {
            const portfolioItem = await fetchPortfolioItem(id);
            setIsModalOpenGallery(true);
            setPortfolioItemDetail(portfolioItem);
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении данных портфолио");
            toast.error(msg);
        }
    }

    const openEditModalGalleryItem = async (id: string) => {
        try {
            const galleryItem = await fetchGalleryItem(id)
            setGalleryItem(galleryItem);
            setIsGalleryEditing(true);
            setIsEditModalOpen(true);
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении данных галереи");
            toast.error(msg);
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
            (text) => setModalText(text)
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
            const msg = await handleKyError(error, "Ошибка при удалении");
            toast.error(msg);
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
            <TableControls
                table={table}
                showConfirm={setShowConfirm}
                setGalleryDelete={setGalleryDelete}
                onFilterChange={handleFilterChange}
                setPersistedPageSize={setPageSize}
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
                    <GalleryEditForm onSaved={() => setIsEditModalOpen(!isEditModalOpen)}/>
                    : <PortfolioEditForm
                        updatePaginationAndData={updatePaginationAndData}
                        onSaved={() => setIsEditModalOpen(!isEditModalOpen)}
                    />
                }
            </ModalEdit>

            {detailItem &&
                <ModalGallery
                    open={isModalOpenGallery}
                    openChange={() => setIsModalOpenGallery(false)}
                    items={detailItem.gallery}
                    keyBy="id"
                    selectedKeys={selectedToDelete}
                    setSelectedKeys={setSelectedToDelete}
                    selectionMode={galleryEditSelectionMode}
                    setSelectionMode={setGalleryEditSelectionMode}
                    isOpenModalEdit={(key) => openEditModalGalleryItem(key)}
                    onRequestDelete={() => {
                        setGalleryDelete(true);
                        setShowConfirm(true);
                    }}
                    deleteLoading={deleteLoading}
                />
            }

            <SaleLabelModal
                saleLabel={modalText}
                onClose={() => setModalText(null)}
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={
                    selectedToDelete.length > 1
                        ? "Удалить выбранные элементы?"
                        : "Удалить элемент?"
                }
                onConfirm={async () => {
                    if (selectedToDelete.length > 1) {
                        await multipleDeletion();
                    } else if (selectedToDelete.length === 1) {
                        await handleDelete(selectedToDelete[0], isGalleryDelete);
                    }
                }}
                loading={deleteLoading}
                text="Это действие невозможно отменить. Элемент будет удален навсегда."
            />
        </>
    )
}

export default AdminPortfolioClient;