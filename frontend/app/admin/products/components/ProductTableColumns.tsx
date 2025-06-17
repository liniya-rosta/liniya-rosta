"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Category, Product } from "@/lib/types";
import {API_BASE_URL} from "@/lib/globalConstants";

export const getProductTableColumns = (
    categories: Category[],
    onEditProduct: (product: Product) => void,
    onDeleteProduct: (id: string) => void,
    actionLoading: boolean
): ColumnDef<Product>[] => {
    const getCategoryTitle = (category: string | Category) => {
        if (typeof category === "object" && category !== null) {
            return category.title;
        }
        const found = categories.find((cat) => cat._id === category);
        return found ? found.title : String(category);
    };

    return [
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
            accessorKey: "image",
            header: "Изображение",
            cell: ({ row }) => {
                const imageUrl = row.original.image;
                return imageUrl ? (
                    <div className="w-16 h-16 relative">
                        <Image
                            src={`${API_BASE_URL}/${imageUrl}`}
                            alt={row.original.title}
                            fill
                            sizes="64px"
                            className="object-cover rounded-md"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop";
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        Нет фото
                    </div>
                );
            },
        },
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Название
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("title")}</div>
            ),
        },
        {
            accessorKey: "category",
            header: "Категория",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {getCategoryTitle(row.original.category)}
                </Badge>
            ),
            filterFn: (row, id, value) => {
                const categoryId =
                    typeof row.original.category === "object"
                        ? row.original.category._id
                        : row.original.category;
                return value.includes(categoryId);
            },
        },
        {
            accessorKey: "description",
            header: "Описание",
            cell: ({ row }) => (
                <div className="line-clamp-2 max-w-xs text-sm text-muted-foreground">
                    {row.getValue("description")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const product = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Открыть меню</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEditProduct(product)} disabled={actionLoading}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDeleteProduct(product._id)}
                                disabled={actionLoading}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};