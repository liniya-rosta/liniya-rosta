'use client';

import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {ImageObject, Post} from "@/src/lib/types";
import {Button} from '@/src/components/ui/button';
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {getPostTableColumns} from './components/DataTable/PostTableColumns';
import PostsTable from "@/src/app/(admin)/admin/blog/components/DataTable/PostsTable";
import DataSkeleton from "@/src/components/shared/DataSkeleton";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import TablePostControls from "@/src/app/(admin)/admin/blog/components/DataTable/TablePostControls";
import TablePostPagination from "@/src/app/(admin)/admin/blog/components/DataTable/TablePostPagination";
import {usePostDeletion} from "@/src/app/(admin)/admin/blog/hooks/usePostDeletion";
import ConfirmDialog from '@/src/components/ui/ConfirmDialog';
import ModalGallery from "@/src/components/shared/ModalGallery";
import ImageEditForm from "@/src/app/(admin)/admin/blog/components/ImageEditForm";
import {usePostsFetcher} from "@/src/app/(admin)/admin/blog/hooks/usePostsFetcher";
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";

const AdminBlogClient = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [showConfirm, setShowConfirm] = useState(false);

    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [imageEditSelectionMode, setImageEditSelectionMode] = useState(false);

    const [isImageModalEdit, setIsImageModalEdit] = useState(false);
    const [selectImageEdit, setSelectImageEdit] = useState<string>("");

    const [previewImage, setPreviewImage] = useState<ImageObject | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const router = useRouter();

    const {
        posts,
        detailPost,
        paginationPost,
        selectedToDelete,
        fetchLoading,
        deleteLoading,
        updateLoading,
        fetchError,
        setDetailPost,
        setSelectedToDelete,
    } = useSuperAdminPostStore();

    const {
        pagination,
        filters,
        fetchData,
        fetchOnePost,
        setPagination,
        handleFilterChange,
        setPageSize,
        handleReorderImages,
    } = usePostsFetcher();

    const {
        isImageDelete,
        handleDelete,
        handleDeleteSelectedPosts,
        setImageDelete,
    } = usePostDeletion(fetchOnePost, fetchData, setRowSelection);

    useEffect(() => {
        void fetchData();
    }, [pagination, filters]);

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedToDelete(selectedRows.map(row => row.original._id));
    }, [rowSelection]);

    useEffect(() => {
        setRowSelection({});
    }, [pagination.pageIndex]);

    const table = useReactTable<Post>({
        data: posts,
        columns: getPostTableColumns(
            (post) =>
                router.push(`/admin/blog/post-form/${post._id}`),
            async ([ids]) => {
                setSelectedToDelete([ids]);
                setShowConfirm(true);
            },
            (post) => {
                setDetailPost(post);
                setIsImagesModalOpen(true);
            }
        ),
        pageCount: paginationPost?.totalPages ?? 1,
        manualPagination: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: (updater) => {
            const newState = typeof updater === "function" ? updater(pagination) : updater;
            setPagination(newState);
            setPageSize(newState.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    if (fetchLoading && posts.length === 0) return <DataSkeleton/>
    if (fetchError) return <ErrorMsg error={fetchError}/>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-23-30-1_5 font-bold text-foreground">Управление постами</h1>
                    <p className="text-muted-foreground mt-1">Создавайте и редактируйте посты</p>
                </div>
                <Link href="/admin/blog/post-form">
                    <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                        <Plus className="mr-2 h-5 w-5"/>
                        Создать пост
                    </Button>
                </Link>
            </div>

            <div>
                <TablePostControls
                    handleBulkDelete={() => setShowConfirm(true)}
                    table={table}
                    onFilterChange={handleFilterChange}
                    setPersistedPageSize={setPageSize}
                />
                <PostsTable table={table}/>
                <TablePostPagination table={table}/>
            </div>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={isImageDelete ? "Удалить изображение?" : "Удалить пост(ы)?"}
                onConfirm={async () => {
                    if (selectedToDelete.length > 1) {
                        await handleDeleteSelectedPosts();
                    } else if (selectedToDelete.length === 1) {
                        await handleDelete();
                    }
                }}
                loading={deleteLoading}
            />

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
                        setIsImageModalEdit(true);
                        setSelectImageEdit(key);
                    }}
                    onRequestDelete={() => {
                        setShowConfirm(true);
                        setImageDelete(true);
                    }}
                    canReorder={true}
                    onSaveOrder={ async (newOrder) => {
                        await handleReorderImages(detailPost._id, newOrder);
                    }}
                    deleteLoading={deleteLoading}
                    updateLoading={updateLoading}
                />
            )
            }

        </div>
    )
};


export default AdminBlogClient;