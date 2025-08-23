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
import {GalleryEditForm, ModalEdit} from "@/src/app/(admin)/admin/portfolio/components/ModelEdit";
import DataSkeleton from "@/src/components/shared/DataSkeleton";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {usePersistedPageSize} from "@/hooks/usePersistedPageSize";
import ModalGallery from "@/src/components/shared/ModalGallery";
import {handleKyError} from "@/src/lib/handleKyError";
import SaleLabelModal from "@/src/app/(admin)/admin/products/components/Modal/SaleLabelModal";
import {useRouter, useSearchParams} from "next/navigation";
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";

interface Props {
    error?: string | null;
}

const AdminPortfolioClient: React.FC<Props> = ({error}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

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

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [isModalOpenCover, setIsModalOpenCover] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpenGallery, setIsModalOpenGallery] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [selectedCover, setSelectedCover] = useState<{ cover: string; alt?: {ru: string} } | null>(null);
    const [isGalleryDelete, setGalleryDelete] = useState<boolean>(false);
    const [galleryEditSelectionMode, setGalleryEditSelectionMode] = useState(false);
    const [filters, setFilters] = useState({ coverAlt: "", description: "", title: "" });
    const initialPage = Number(searchParams.get("page")) || 1;

    const [pageSize, setPageSize] = usePersistedPageSize("admin_portfolio_table_size");
    const [pagination, setPagination] = useState({
        pageIndex: initialPage - 1,
        pageSize: pageSize,
    });

    const [modalText, setModalText] = useState<string | null>(null);

    const updatePaginationAndData = async (searchValue = "", searchField = "coverAlt") => {
        try {
            const filters = {
                title: "",
                coverAlt: "",
                description: "",
            };
            if (searchField === "title") filters.coverAlt = searchValue;
            if (searchField === "coverAlt") filters.coverAlt = searchValue;
            if (searchField === "description") filters.description = searchValue;

            const data = await fetchPortfolioPreviews(
                pagination.pageSize.toString(),
                (pagination.pageIndex + 1).toString(),
                filters.title,
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

    const fetchData = async () => {
        try {
            const data = await fetchPortfolioPreviews(
                pagination.pageSize.toString(),
                (pagination.pageIndex + 1).toString(),
                filters.coverAlt,
                filters.description,
                filters.title,
            );
            setPortfolioPreview(data.items);
            setPaginationPortfolio({
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
            });
        } catch (error) {
            const msg = await handleKyError(error, "Ошибка при получении данных портфолио");
            toast.error(msg);
        } finally {
            setPortfolioFetchLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ pagination.pageIndex,
        pagination.pageSize,
        filters.coverAlt,
        filters.description,
        filters.title,
    ]);

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedToDelete(selectedRows.map(row => row.original._id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    useEffect(() => {
        setRowSelection({});
    }, [pagination.pageIndex]);

    useEffect(() => {
        const urlPage = Number(searchParams.get("page")) || 1;
        if (urlPage - 1 !== pagination.pageIndex) {
            setPagination((prev) => ({
                ...prev,
                pageIndex: urlPage - 1,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        const currentUrlPage = Number(searchParams.get("page")) || 1;
        if (pagination.pageIndex + 1 !== currentUrlPage) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", (pagination.pageIndex + 1).toString());
            router.replace(`?${newParams.toString()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            (item) =>
                router.push(`/admin/portfolio/portfolio-form/${item._id}`),
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
        setFilters((prev) => ({ ...prev, [column]: value }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
                <ImageViewerModal
                    open={isModalOpenCover}
                    openChange={() => setIsModalOpenCover(!isModalOpenCover)}
                    alt={selectedCover.alt}
                    image={selectedCover.cover}
                />
            }

            <ModalEdit
                open={isEditModalOpen}
                openChange={() => setIsEditModalOpen(!isEditModalOpen)}>
                <GalleryEditForm onSaved={() => setIsEditModalOpen(!isEditModalOpen)}/>

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