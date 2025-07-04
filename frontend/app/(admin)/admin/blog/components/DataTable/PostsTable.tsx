"use client";

import React, {useEffect, useState} from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Post} from "@/lib/types";
import {getPostTableColumns} from "./PostTableColumns";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TableControls from "@/app/(admin)/admin/blog/components/DataTable/TableControls";
import TablePagination from "@/app/(admin)/admin/blog/components/DataTable/TablePagination";
import { fetchPosts } from '@/actions/posts';
import {useAdminPostStore} from "@/store/superadmin/superAdminPostsStore";

interface PostsTableProps {
    posts: Post[];
    onEditPost: (post: Post) => void;
    onDeletePost: (id: string) => void;
    onDeleteSelectedPosts: (ids: string[]) => void;
    actionLoading: boolean;
    onPageSizeChange: (size: string) => void;
    pagination: { pageIndex: number; pageSize: number };
    onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
    totalPages?:number;
}

export type FilterType = 'title' | 'description';

const PostsTable: React.FC<PostsTableProps> = (
    {posts, onEditPost, onDeletePost, onDeleteSelectedPosts, actionLoading, onPageSizeChange, pagination, onPaginationChange, totalPages=1}
) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const [selectedPostImages, setSelectedPostImages] = useState<{ image: string, alt?: string }[] | null>(null);
    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

    const [activeFilterType, setActiveFilterType] = React.useState<FilterType>('title');
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredPosts, setFilteredPosts] = React.useState<Post[]>(posts);

    const {setPaginationPost} = useAdminPostStore();

    const columns = React.useMemo(
        () => getPostTableColumns(
            onEditPost,
            (id: string) => {
                setIdsToDelete([id]);
                setShowConfirmDialog(true);
            },
            actionLoading,
            (post: Post) => {
                setSelectedPostImages(post.images);
                setIsImagesModalOpen(true);
            }
        ),
        [onEditPost, actionLoading]
    );

    React.useEffect(() => {
        if (filterValue) {
            const lowercasedFilterValue = filterValue.toLowerCase();
            const newFilteredPosts = posts.filter(post => {
                if (activeFilterType === 'title') {
                    return post.title.toLowerCase().includes(lowercasedFilterValue);
                }
                if (activeFilterType === 'description') {
                    return post.description.toLowerCase().includes(lowercasedFilterValue);
                }
                return true;
            });
            setFilteredPosts(newFilteredPosts);
        } else {
            setFilteredPosts(posts);
        }
    }, [posts, activeFilterType, filterValue]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPosts(
                pagination.pageSize.toString(),
                (pagination.pageIndex + 1).toString(),
            );
            setFilteredPosts(data.items);
            setPaginationPost({
                total: data.total,
                totalPages: data.totalPages,
                page: data.page,
                pageSize: data.pageSize,
            });
        };

        void fetchData();
    }, [pagination.pageIndex, pagination.pageSize]);


    const getFilterPlaceholder = () => {
        switch (activeFilterType) {
            case 'title':
                return 'Фильтр по названию';
            case 'description':
                return 'Фильтр по описанию';
            default:
                return 'Введите значение для фильтра';
        }
    };

    const table = useReactTable({
        data: filteredPosts,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        pageCount: totalPages,
        onPaginationChange,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    const handleBulkDelete = () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original._id);
        if (selectedIds.length > 0) {
            setIdsToDelete(selectedIds);
            setShowConfirmDialog(true);
        }
    };

    const confirmDeletion = () => {
        if (idsToDelete.length > 1) {
            onDeleteSelectedPosts(idsToDelete);
            table.toggleAllRowsSelected(false);
        } else if (idsToDelete.length === 1) {
            onDeletePost(idsToDelete[0]);
        }
        setShowConfirmDialog(false);
        setIdsToDelete([]);
    };

    const confirmDialogTitle = idsToDelete.length > 1
        ? `Удалить выбранные ${idsToDelete.length} постов?`
        : "Удалить пост?";

    return (
        <div className="w-full">
            <TableControls
                table={table}
                actionLoading={actionLoading}
                getFilterPlaceholder={getFilterPlaceholder}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                activeFilterType={activeFilterType}
                setActiveFilterType={setActiveFilterType}
                handleBulkDelete={handleBulkDelete}
                onPageSizeChange={onPageSizeChange}
            />

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="min-w-[100px]">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Нет результатов.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination table={table}/>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={confirmDialogTitle}
                onConfirm={confirmDeletion}
                loading={actionLoading}
            >
            </ConfirmDialog>
        </div>
    );
};

export default PostsTable;