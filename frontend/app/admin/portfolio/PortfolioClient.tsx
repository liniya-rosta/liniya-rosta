'use client'

import {PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, {useState} from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/globalConstants";
import { ModalImage } from "@/components/shared/ModalImage";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export const getColumns = (
    onImageClick: (image: { cover: string; alt: string }) => void
): ColumnDef<PortfolioItemPreview>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "description",
        header: "Описание",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "alt",
        header: "Альтернативное название обложки",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("alt")}</div>
        ),
    },
    {
        accessorKey: "galleryCount",
        header: () => <div className="text-right">Кол-во изображений</div>,
        cell: ({ row }) => {
            const count = row.getValue<number>("galleryCount");
            return (
                <div className="text-center font-medium">
                    {count}
                </div>
            );
        }
    },
    {
        accessorKey: "cover",
        header: "Обложка",
        cell: ({ row }) => {
            const cover: string = row.getValue("cover");
            const alt: string = row.getValue("alt");
            const imageUrl = `${API_BASE_URL}/${cover}`;

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className="relative w-16 h-16 rounded overflow-hidden cursor-pointer"
                            onClick={() => onImageClick({cover, alt})}
                        >
                            <Image
                                src={imageUrl}
                                alt="Обложка"
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Нажмите чтобы просмотреть изображение</p>
                    </TooltipContent>
                </Tooltip>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment._id)}
                        >
                            Копировать ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>Посмотреть галерею</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

interface Props {
    data: PortfolioItemPreview[];
}

const AdminPortfolioClient: React.FC<Props> = ({data}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<PortfolioItemDetail | null>(null);

    const table = useReactTable({
        data,
        columns: getColumns((image) => {
            setSelectedImage(image);
            setIsModalOpen(true);
        }),
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

    return (
        <div className="">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Фильтр по описанию..."
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("description")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Button variant="outline" className="ml-auto">Создать портфолио</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Колонки <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Нет данных.
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


            {isModalOpen && selectedImage && (
                <ModalImage isOpen={true} onClose={() => setIsModalOpen(false)}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${API_BASE_URL}/${selectedImage.cover}`}
                        onClick={(e) => e.preventDefault()}
                        className="block max-w-[90vw] max-h-[90vh] w-auto h-auto cursor-default"
                    >
                        <Image
                            src={`${API_BASE_URL}/${selectedImage.cover}`}
                            alt={selectedImage.alt}
                            width={800}
                            height={600}
                            className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                        />
                    </a>
                </ModalImage>
            )}

        </div>
    )
}

export default AdminPortfolioClient;