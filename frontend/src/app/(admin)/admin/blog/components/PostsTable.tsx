"use client";

import React from 'react';
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
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Post } from "@/src/lib/types";
import { getPostTableColumns } from "./PostTableColumns";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";

interface PostsTableProps {
    posts: Post[];
    onEditPost: (post: Post) => void;
    onDeletePost: (id: string) => void;
    onDeleteSelectedPosts: (ids: string[]) => void;
    actionLoading: boolean;
}

type FilterType = 'title' | 'description';

const PostsTable: React.FC<PostsTableProps> = ({posts, onEditPost, onDeletePost, onDeleteSelectedPosts, actionLoading,}) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

    const [activeFilterType, setActiveFilterType] = React.useState<FilterType>('title');
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredPosts, setFilteredPosts] = React.useState<Post[]>(posts);

    const columnLabels: Record<string, string> = {
        "select": "Выбрать",
        "image": "Изображение",
        "title": "Заголовок",
        "description": "Описание",
    };

    const columns = React.useMemo(
        () => getPostTableColumns(
            onEditPost,
            (id: string) => {
                setIdsToDelete([id]);
                setShowConfirmDialog(true);
            },
            actionLoading
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
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
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
            <div className="flex items-center py-4 flex-wrap gap-2">
                <Select value={activeFilterType} onValueChange={(value: FilterType) => {
                    setActiveFilterType(value);
                    setFilterValue('');
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Выберите фильтр"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="title">По названию</SelectItem>
                        <SelectItem value="description">По описанию</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    placeholder={getFilterPlaceholder()}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="flex-grow max-w-sm"
                />

                <Button
                    disabled={actionLoading || table.getFilteredSelectedRowModel().rows.length === 0}
                    onClick={handleBulkDelete}
                    variant='outline'
                >
                    Удалить выбранные {table.getFilteredSelectedRowModel().rows.length} элементы
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Столбцы <ChevronDown className="ml-2 h-4 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(value)
                                        }
                                    >
                                        {columnLabels[column.id] ?? column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} из{" "}
                    {table.getFilteredRowModel().rows.length} выбрано.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Далее
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={confirmDialogTitle}
                onConfirm={confirmDeletion}
                loading={actionLoading}
                text="Это действие невозможно отменить. Элемент будет удален навсегда."
            >
            </ConfirmDialog>
        </div>
    );
};

export default PostsTable;