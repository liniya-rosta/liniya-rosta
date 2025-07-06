'use client';

import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {Post, PostResponse} from "@/lib/types";
import {Button} from '@/components/ui/button';
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, PaginationState,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {useSuperAdminPostStore} from "@/store/superadmin/superAdminPostsStore";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";
import { getPostTableColumns } from './components/DataTable/PostTableColumns';
import PostsTable from "@/app/(admin)/admin/blog/components/DataTable/PostsTable";
import DataSkeleton from "@/components/ui/Loading/DataSkeleton";
import ErrorMsg from "@/components/ui/ErrorMsg";
import TablePostControls from "@/app/(admin)/admin/blog/components/DataTable/TablePostControls";
import TablePostPagination from "@/app/(admin)/admin/blog/components/DataTable/TablePostPagination";
import {usePostsControlPanel} from "@/app/(admin)/admin/blog/hooks/usePostsControlPanel";
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Props {
    data: PostResponse | null;
    error: string | null;
    isAdmin?: boolean;
    limit?: string;
}

const AdminBlogClient: React.FC<Props> = ({data, error, isAdmin = true, limit="10"}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: Number(limit),
    });

    const [showConfirm, setShowConfirm] = useState(false);

    const {
        posts,
        paginationPost,
        selectedToDelete,
        fetchLoading,
        deleteLoading,
        setPosts,
        setPaginationPost,
        setFetchLoading,
        setSelectedToDelete,
    } = useSuperAdminPostStore();

    const {
        handleDelete,
        handleDeleteSelectedPosts,
        updatePaginationAndData,
    } = usePostsControlPanel(data, error, limit, pagination);


    useEffect(() => {
        try {
            void updatePaginationAndData();
        } catch (err) {
            let errorMessage = "Ошибка при получении данных";
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setFetchLoading(false)
        }

    }, [pagination]);

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
                console.log("edit"),
            async ([ids]) => {
                setSelectedToDelete([ids]);
                setShowConfirm(true);
            },
            (post) => {
                console.log("delete", post);
            }
        ),
        pageCount: paginationPost?.totalPages ?? 1,
        manualPagination: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
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

    const handleFilterChange = (column: string, value: string) => {
        void updatePaginationAndData(value, column);
    };

    if (fetchLoading) return <DataSkeleton/>
    if (error) return <ErrorMsg error={error}/>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Управление постами</h1>
                    <p className="text-muted-foreground mt-1">Создавайте и редактируйте посты</p>
                </div>
                {isAdmin && (
                    <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                        <Plus className="mr-2 h-5 w-5"/>
                        Создать пост
                    </Button>
                )}
            </div>

            <div>
                <TablePostControls
                    handleBulkDelete={()=> setShowConfirm(true)}
                    table={table}
                    onFilterChange={handleFilterChange}
                />
                <PostsTable table={table}/>
                <TablePostPagination table={table}/>
            </div>


            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={"Delete"}
                onConfirm={ async () => {
                    if (selectedToDelete.length > 1) {
                        await handleDeleteSelectedPosts();
                    } else if (selectedToDelete.length === 1) {
                        await handleDelete();
                    }
                }}
                loading={deleteLoading}
            />


        </div>
    );
};


export default AdminBlogClient;