import {ColumnDef} from "@tanstack/react-table";
import Image from "next/image";
import React from "react";
import {Checkbox} from "@/src/components/ui/checkbox";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import {Category, Product} from "@/src/lib/types";
import {IMG_BASE} from "@/src/lib/globalConstants";
import {Button} from "@/src/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {Edit2, Images, MoreHorizontal, Trash2} from "lucide-react";
import {Badge} from "@/src/components/ui/badge";

export const getProductTableColumns = (
    categories: Category[],
    onDeleteProduct: (id: string) => void,
    onEditProduct: (product: Product) => void,
    actionLoading: boolean,
    onImageClick: (image: { url: string; alt: { ru: string, ky: string } }) => void,
    onSaleLabelClick: (label: string) => void,
onImagesClick: (data: {
        productId: string;
        images: { image: string; alt?: { ru: string, ky: string } | null; _id?: string }[]
    }) => void): ColumnDef<Product>[] => {
    const getCategoryTitle = (category: string | Category) => {
        if (typeof category === "object" && category !== null) {
            return category.title.ru;
        }
        const found = categories.find((cat) => cat._id === category);
        return found ? found.title.ru : String(category);
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
                                onClick={() => onImageClick({
                                    url: imageUrl,
                                    alt: {ru: row.original.cover?.alt?.ru || "Обложка", ky: ""}
                                })}
                            >
                                <Image
                                    src={`${IMG_BASE}/${imageUrl}`}
                                    alt={row.original.cover?.alt?.ru || "Обложка"}
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
            cell: ({row}) => row.original.title.ru || "—",
        },
        {
            accessorKey: "category",
            header: "Категория",
            cell: ({row}) => (
                <Badge variant="outline">
                    {getCategoryTitle(row.original.category.title.ru)}
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
            cell: ({row}) => {
                const text = row.original.description?.ru || "—";
                if (text === "—") return text;

                if (text.length > 30) {
                    const preview = text.slice(0, 30) + "...";
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="cursor-pointer text-sm"
                                    onClick={() => onSaleLabelClick(text)}
                                >
                                     {preview}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Нажмите чтобы посмотреть полное описание</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                }

                return <span className="text-sm">{text}</span>;
            },
        },
        {
            accessorKey: "characteristics",
            header: "Характеристики",
            cell: ({ row }) => {
                const chars = Array.isArray(row.original.characteristics)
                    ? row.original.characteristics
                    : [];

                if (!chars.length) return "—";

                const previewItems = chars
                    .slice(0, 3)
                    .map((c) => `${c.key?.ru}: ${c.value?.ru}`);

                const fullHtmlList = `
                        <ul style="padding-left:20px;list-style:disc;margin:0">
                        ${chars
                        .map((c) => `<li>${c.key?.ru}: ${c.value?.ru}</li>`)
                        .join("")}
                         </ul>`;

                const Preview = (
                    <div className="text-sm max-w-[300px]">
                        {previewItems.map((line, i) => (
                            <div key={i} className="truncate" title={line}>
                                {line}
                            </div>
                        ))}
                    </div>
                );

                if (chars.length > 3) {
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="cursor-pointer max-w-[300px]"
                                    onClick={() => onSaleLabelClick(fullHtmlList)}
                                    aria-label="Показать все характеристики"
                                >
                                    {Preview}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[420px]">
                                <p>Нажмите чтобы посмотреть все характеристики</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                }

                return Preview;
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
                                onClick={() => onImageClick({
                                    url: iconUrl,
                                    alt: {ru: row.original.icon?.alt?.ru || "Иконка", ky: ""}
                                })}
                            >
                                <Image
                                    src={`${IMG_BASE}/${iconUrl}`}
                                    alt={row.original.icon?.alt?.ru || "Иконка"}
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

                if (!row.original.sale?.isOnSale) return "—";

                if (saleLabel) {
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="inline-flex items-center justify-center w-8 h-8 cursor-pointer"
                                    onClick={() => onSaleLabelClick(saleLabel)}
                                >
                                    Да
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Нажмите чтобы подробнее посмотреть акцию</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                } else {
                    return 'Да';
                }
            },
        },
        {
            accessorKey: "seoTitle",
            header: "SEO заголовок",
            cell: ({row}) => {
                const text = row.original.seoTitle?.ru || "—";
                if (text === "—") return text;

                if (text.length > 30) {
                    const preview = text.slice(0, 30) + "...";
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="cursor-pointer text-sm"
                                    onClick={() => onSaleLabelClick(text)}
                                >
                                    {preview}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Нажмите чтобы посмотреть полный SEO заголовок</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                }

                return <span className="text-sm">{text}</span>;
            },
        },
        {
            accessorKey: "seoDescription",
            header: "SEO описание",
            cell: ({row}) => {
                const text = row.original.seoDescription.ru || "—";
                if (text === "—") return text;

                const preview = text.length > 30 ? text.slice(0, 30) + "..." : text;

                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className="cursor-pointer text-sm"
                                onClick={() => onSaleLabelClick(text)}
                            >
                                {preview}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Нажмите чтобы посмотреть полное SEO описание</p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
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
                            <DropdownMenuItem
                                onClick={() => onEditProduct(product)}
                                disabled={actionLoading}
                                className="cursor-pointer"
                            >
                                <Edit2 className="mr-2 h-4 w-4"/>
                                Редактировать
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => onImagesClick({
                                    productId: product._id,
                                    images: product.images.map((img) => ({
                                        ...img,
                                        alt: {ru: img.alt?.ru || "-", ky: ""},
                                    })),
                                })}
                                className="cursor-pointer"
                            >
                                <Images className="mr-2 h-4 w-4"/>
                                Изображения
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => onDeleteProduct(product._id)}
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