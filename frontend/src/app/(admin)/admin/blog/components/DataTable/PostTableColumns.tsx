import {ColumnDef} from '@tanstack/react-table';
import {ArrowUpDown, Edit2, Images, MoreHorizontal, Trash2} from 'lucide-react';
import Image from 'next/image';

import {Button} from '@/src/components/ui/button';
import {Checkbox} from '@/src/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu';
import {Post} from '@/src/lib/types';
import {IMG_BASE} from '@/src/lib/globalConstants';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/src/components/ui/tooltip';
import React from "react";

export const getPostTableColumns = (
    onEditPost: (post: Post) => void,
    onDeletePost: (ids: string[]) => void,
    onOpenImagesModal: (post: Post) => void
): ColumnDef<Post>[] => {
    return [
        {
            id: 'select',
            header: ({table}) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
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
            meta: {
                className: "w-10",
            },
        },
        {
            id: "index",
            header: "№",
            cell: ({row, table}) => {
                const flatRows = table.getRowModel().flatRows;
                const originalIndex = flatRows.findIndex(r => r.id === row.id);
                return <span className="w-auto">{originalIndex + 1}</span>;
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'title',
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Заголовок
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                );
            },
            cell: ({row}) =>
                <div className="font-medium max-w-[200px] truncate">
                    {row.original.title.ru}
                </div>,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'description',
            header: 'Описание',
            cell: ({row}) => (
                <div className="line-clamp-2 max-w-sm text-sm text-muted-foreground">
                    {row.original.description.ru}
                </div>
            ),
            filterFn: 'includesString',
        },
        {
            accessorKey: "imageCount",
            header: () => <div className="text-center">Кол-во изображений</div>,
            cell: ({row}) => {
                const count = row.getValue<number>("imageCount");
                return (
                    <div className="font-medium text-center">
                        {count}
                    </div>
                );
            },
        },
        {
            accessorKey: "seoTitle",
            header: "SEO заголовок",
            cell: ({row}) => row.original.seoTitle?.ru || "—",
        },
        {
            accessorKey: "seoDescription",
            header: "SEO описание",
            cell: ({row}) => {
                const text = row.original.seoDescription?.ru || "—";
                if (text === "—") return text;
                return text
            },
        },
        {
            accessorKey: 'image',
            header: 'Изображение',
            cell: ({row}) => {
                const imageUrl = row.original.images?.[0]?.image;
                return imageUrl ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="w-16 h-16 relative flex-shrink-0 cursor-pointer"
                                onClick={() => onOpenImagesModal(row.original)}
                            >
                                <Image
                                    src={`${IMG_BASE}/${imageUrl}`}
                                    alt={row.original.title.ru}
                                    fill
                                    sizes="64px"
                                    className="object-cover rounded-md"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
                                    }}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Нажмите чтобы просмотреть все изображения</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <div
                        className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground text-center flex-shrink-0">
                        Нет фото
                    </div>
                );
            },
        },
        {
            id: 'действия',
            enableHiding: false,
            cell: ({row}) => {
                const post = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Открыть меню</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => onOpenImagesModal(post)}
                            >
                                <Images className="mr-2 h-4 w-4"/>
                                Все изображения
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditPost(post)}>
                                <Edit2 className="mr-2 h-4 w-4"/>
                                Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDeletePost([post._id])}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};