import {ColumnDef} from "@tanstack/react-table";
import {PortfolioItemPreview} from "@/lib/types";
import {API_BASE_URL} from "@/lib/globalConstants";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import React from "react";
import {Checkbox} from "@/components/ui/checkbox";

export const getColumns = (
    onImageClick: (image: { cover: string; alt: string }) => void,
    onRequestDelete: (id: string, cover: string) => void,
    onEditCover: (id: string) => void,
    onGallery: (id: string) => void,
): ColumnDef<PortfolioItemPreview>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
        id: "index",
        header: "№",
        cell: ({row}) => {
            return <div>{row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "coverAlt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Альтер-ое название обложки
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("coverAlt")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Описание",
        cell: ({ row }) => {
            const value = row.getValue("description") as string | undefined;
            return (
                <div className="capitalize">
                    {value?.trim() ? value : <span className="text-muted-foreground italic">Нет описания</span>}
                </div>
            );
        },
    },
    {
        accessorKey: "galleryCount",
        header: () => <div className="text-center">Кол-во изображений</div>,
        cell: ({row}) => {
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
        cell: ({row}) => {
            const cover: string = row.getValue("cover");
            const alt: string = row.getValue("coverAlt");
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
                                priority
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
        cell: ({row}) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Меню</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onGallery(payment._id)}>
                            Посмотреть галерею
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCover(payment._id)}>
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRequestDelete(payment._id, payment.cover)}>
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]