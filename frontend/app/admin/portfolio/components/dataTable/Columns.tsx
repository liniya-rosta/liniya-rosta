import {ColumnDef} from "@tanstack/react-table";
import {PortfolioItemPreview} from "@/lib/types";
import {Checkbox} from "@/components/ui/checkbox";
import {API_BASE_URL} from "@/lib/globalConstants";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import React from "react";

export const getColumns = (
    onImageClick: (image: { cover: string; alt: string }) => void
): ColumnDef<PortfolioItemPreview>[] => [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
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
        accessorKey: "coverAlt",
        header: "Альтернативное название обложки",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("coverAlt")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Описание",
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "galleryCount",
        header: () => <div className="text-right">Кол-во изображений</div>,
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
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment._id)}
                        >
                            Копировать ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>Посмотреть галерею</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]