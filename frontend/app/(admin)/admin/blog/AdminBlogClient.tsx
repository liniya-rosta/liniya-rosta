'use client';

import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {ImageObject, Post, PostResponse} from "@/lib/types";
import {Button} from '@/components/ui/button';
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
import PostsTable from "@/app/(admin)/admin/blog/components/DataTable/PostsTable";
import DataSkeleton from "@/components/ui/Loading/DataSkeleton";
import ErrorMsg from "@/components/ui/ErrorMsg";
import TablePostControls from "@/app/(admin)/admin/blog/components/DataTable/TablePostControls";
import TablePostPagination from "@/app/(admin)/admin/blog/components/DataTable/TablePostPagination";
import {usePostDeletion} from "@/app/(admin)/admin/blog/hooks/usePostDeletion";
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ModalGallery from "@/components/shared/ModalGallery";
import ImageEditForm from "@/app/(admin)/admin/blog/components/ImageEditForm";
import {PostsFetcher} from "@/app/(admin)/admin/blog/hooks/usePostsFetcher";
import {ImagePreviewModal} from "@/app/(admin)/admin/blog/components/ImagePreviewModal";

interface Props {
    data: PostResponse | null;
    error: string | null;
}

const AdminBlogClient: React.FC<Props> = ({data, error}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [showConfirm, setShowConfirm] = useState(false);

    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);

    const [isImageModalEdit, setIsImageModalEdit] = useState(false);
    const [selectImageEdit, setSelectImageEdit] = useState<string>("");

    const [previewImage, setPreviewImage] = useState<ImageObject | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const {
        posts,
        detailPost,
        paginationPost,
        selectedToDelete,
        fetchLoading,
        deleteLoading,
        setDetailPost,
        setSelectedToDelete,
    } = useSuperAdminPostStore();

    // хук для получения данных
    const {
        pagination,
        filters,
        fetchData,
        fetchOnePost,
        setPagination,
        handleFilterChange,
        setPageSize,
    } = PostsFetcher();

    //хук для удаления
    const {
        isImageDelete,
        handleDelete,
        handleDeleteSelectedPosts,
        setImageDelete,
    } = usePostDeletion(fetchData, fetchOnePost, setRowSelection);

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
                // router.push(`/admin/blog/edit/${post._id}`)
                console.log("edit", post),
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

    if (fetchLoading) return <DataSkeleton/>
    if (error) return <ErrorMsg error={error}/>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Управление постами</h1>
                    <p className="text-muted-foreground mt-1">Создавайте и редактируйте посты</p>
                </div>
                <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="mr-2 h-5 w-5"/>
                    Создать пост
                </Button>
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

            <ImagePreviewModal
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                image={previewImage}
            />

            {detailPost && (
                <ModalGallery
                    open={isImagesModalOpen}
                    openChange={() => setIsImagesModalOpen(false)}
                    items={detailPost.images}
                    keyBy="image"
                    selectedKeys={selectedToDelete}
                    setSelectedKeys={setSelectedToDelete}
                    selectionMode={selectionMode}
                    setSelectionMode={setSelectionMode}
                    onEdit={(key) => {
                        setIsImageModalEdit(true)
                        setSelectImageEdit(key)
                    }}
                    onDelete={(keys) => {
                        setSelectedToDelete(keys);
                        setShowConfirm(true);
                        setImageDelete(true);
                    }}
                    deleteLoading={deleteLoading}
                />
            )}

        </div>
    );
};


export default AdminBlogClient;