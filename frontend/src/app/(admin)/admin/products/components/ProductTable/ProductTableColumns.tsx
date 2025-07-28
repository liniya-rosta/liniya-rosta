import {ColumnDef} from "@tanstack/react-table";
import Image from "next/image";
import React from "react";
import {Checkbox} from "@/src/components/ui/checkbox";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import {Category, Product} from "@/src/lib/types";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {Button} from "@/src/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/src/components/ui/dropdown-menu";
import {Edit2, Images, MoreHorizontal, Trash2} from "lucide-react";
import {Badge} from "@/src/components/ui/badge";

export const getProductTableColumns = (
    categories: Category[],
    onEditProduct: (product: Product) => void,
    onDeleteProduct: (id: string) => void,
    actionLoading: boolean,
    onImageClick: (image: { url: string; alt: string }) => void,
    onSaleLabelClick: (label: string) => void,
    onImagesClick: (data: {
        productId: string;
        images: { url: string; alt?: string | null; _id: string }[]
    }) => void): ColumnDef<Product>[] => {
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
            header: ({table}) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Выбрать все"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Выбрать строку"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "cover",
            header: "Обложка",
            cell: ({row}) => {
                const imageUrl = row.original.cover?.url;
                return imageUrl ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="w-16 h-16 relative cursor-pointer"
                                onClick={() => onImageClick({url: imageUrl, alt: row.original.cover?.alt || "cover"})}
                            >
                                <Image
                                    src={`${API_BASE_URL}/${imageUrl}`}
                                    alt={row.original.cover?.alt || "Обложка"}
                                    fill
                                    sizes="64px"
                                    className="object-cover rounded-md"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Нажмите чтобы просмотреть изображение</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <div
                        className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        Нет фото
                    </div>
                );
            },
        },
        {
            accessorKey: "title",
            header: "Название",
            cell: ({row}) => row.original.title || "—",
        },
        {
            accessorKey: "category",
            header: "Категория",
            cell: ({row}) => (
                <Badge variant="outline">
                    {getCategoryTitle(row.original.category)}
                </Badge>
            ),
            filterFn: (row, value) => {
                if (!value) return true;

                const categoryId =
                    typeof row.original.category === "object"
                        ? row.original.category._id
                        : row.original.category;
                return categoryId === value;
            },
        },
        {
            accessorKey: "description",
            header: "Описание",
            cell: ({row}) => (
                <div className="w-60 max-h-24 overflow-auto text-sm break-words whitespace-pre-wrap">
                    {row.original.description || (
                        <span className="text-muted-foreground italic">Нет описания</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "characteristics",
            header: "Характеристики",
            cell: ({row}) => {
                const characteristics = row.original.characteristics;

                if (!Array.isArray(characteristics) || characteristics.length === 0) {
                    return "—";
                }

                return (
                    <div className="max-h-24 overflow-y-auto">
                        <ul className="list-disc ml-4 space-y-1 text-sm pr-2">
                            {characteristics.map((char, idx) => (
                                <li key={idx}>
                                    <span className="font-medium">{char.key}:</span> {char.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            },
        },
        {
            accessorKey: "icon",
            header: "Иконка",
            cell: ({row}) => {
                const iconUrl = row.original.icon?.url;
                return iconUrl ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="w-8 h-8 relative cursor-pointer"
                                onClick={() => onImageClick({url: iconUrl, alt: row.original.icon?.alt || "icon"})}
                            >
                                <Image
                                    src={`${API_BASE_URL}/${iconUrl}`}
                                    alt={row.original.icon?.alt || "Иконка"}
                                    fill
                                    sizes="32px"
                                    className="object-cover rounded"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Нажмите чтобы просмотреть иконку</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    "—"
                );
            },
        },
        {
            accessorKey: "sale",
            header: "Скидка",
            cell: ({row}) => {
                const saleLabel = row.original.sale?.label;

                if (saleLabel) {
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="w-8 h-8 relative cursor-pointer"
                                    onClick={() => onSaleLabelClick(saleLabel)}
                                >
                                    {row.original.sale?.isOnSale ? 'Да' : '—'}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Нажмите чтобы подробнее подробнее посмотреть акцию</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                } else {
                    return (
                        row.original.sale?.isOnSale ? 'Да' : "—"
                    );
                }
            }
        },
        {
            accessorKey: "seoTitle",
            header: "SEO заголовок",
            cell: ({ row }) => row.original.seoTitle || "—",
        },
        {
            accessorKey: "seoDescription",
            header: "SEO описание",
            cell: ({ row }) => (
                <div className="w-60 max-h-24 overflow-auto text-sm break-words whitespace-pre-wrap">
                    {row.original.seoDescription || (
                        <span className="text-muted-foreground italic">Нет описания</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "images",
            header: "Изображения",
            cell: ({row}) => Array.isArray(row.original.images) ? `${row.original.images.length}` : "0",
        },
        {
            id: "actions",
            header: "Меню",
            enableHiding: false,
            cell: ({row}) => {
                const product = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditProduct(product)}
                                              disabled={actionLoading}
                                              className="cursor-pointer">
                                <Edit2 className="mr-2 h-4 w-4"/>

                                Редактировать
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => onImagesClick({productId: product._id, images: product.images})}
                                className="cursor-pointer"
                            >
                                <Images className="mr-2 h-4 w-4"/>
                                Изображения
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onDeleteProduct(product._id)}
                                              disabled={actionLoading}
                                              className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4 text-red-600 focus:text-red-600"/>
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};