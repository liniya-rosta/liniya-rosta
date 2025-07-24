'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Post } from '@/src/lib/types';
import { API_BASE_URL } from '@/src/lib/globalConstants';

export const getPostTableColumns = (
    onEditPost: (post: Post) => void,
    onDeletePost: (id: string) => void,
    actionLoading: boolean
): ColumnDef<Post>[] => {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Выбрать все"
                />
            ),
            cell: ({ row }) => (
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
            accessorKey: 'image',
            header: 'Изображение',
            cell: ({ row }) => {
                const imageUrl = row.original.image;
                return imageUrl ? (
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                            src={`${API_BASE_URL}/${imageUrl}`}
                            alt={row.original.title}
                            fill
                            sizes="64px"
                            className="object-cover rounded-md"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop';
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground text-center flex-shrink-0">
                        Нет фото
                    </div>
                );
            },
        },
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Заголовок
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium max-w-[200px] truncate">{row.getValue('title')}</div>,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'description',
            header: 'Описание',
            cell: ({ row }) => (
                <div className="line-clamp-2 max-w-sm text-sm text-muted-foreground min-w-[250px]">
                    {row.getValue('description')}
                </div>
            ),
            filterFn: 'includesString',
        },
        {
            id: 'действия',
            enableHiding: false,
            cell: ({ row }) => {
                const post = row.original;

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
                            <DropdownMenuItem onClick={() => onEditPost(post)} disabled={actionLoading}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDeletePost(post._id)}
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