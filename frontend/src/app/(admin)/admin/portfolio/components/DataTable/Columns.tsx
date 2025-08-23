import {ColumnDef} from "@tanstack/react-table";
import {PortfolioItemPreview} from "@/src/lib/types";
import {IMG_BASE} from "@/src/lib/globalConstants";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {Button} from "@/src/components/ui/button";
import {ArrowUpDown, Edit2, Images, MoreHorizontal, Trash2} from "lucide-react";
import React from "react";
import {Checkbox} from "@/src/components/ui/checkbox";

export const getColumns = (
    onImageClick: (image: { cover: string; alt: {ru: string} }) => void,
    onRequestDelete: (id: string) => void,
    onEditPortfolio: (item: PortfolioItemPreview) => void,
    onGallery: (id: string) => void,
    onSaleLabelClick: (text: string) => void,
): ColumnDef<PortfolioItemPreview>[] => [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
        id: "index",
        header: "№",
        cell: ({row, table}) => {
            const flatRows = table.getRowModel().flatRows;
            const originalIndex = flatRows.findIndex(r => r.id === row.id);
            return <div>{originalIndex + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title.ru",
        header: () => <div className="text-left">Заголовок</div>,
        cell: ({row}) => {
            const text = row.original.title?.ru || "—";
            if (text === "—") return text;

            if (text.length > 30) {
                const preview = text.slice(0, 30) + "...";
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className="cursor-pointer text-sm max-w-[320px] truncate inline-block align-top"
                                onClick={() => onSaleLabelClick(text)}
                                title={text}
                            >
                                {preview}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[520px]">
                            <p>Нажмите чтобы посмотреть полный заголовок</p>
                        </TooltipContent>
                    </Tooltip>
                );
            }

            return <span className="text-sm">{text}</span>;
        },
    },
    {
        accessorKey: "seoTitle.ru",
        header: () => <div className="text-left">SEO заголовок</div>,
        cell: ({row}) => {
            const text = row.original.seoTitle?.ru || "—";
            if (text === "—") return text;

            if (text.length > 30) {
                const preview = text.slice(0, 30) + "...";
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className="cursor-pointer text-sm max-w-[320px] truncate inline-block align-top"
                                onClick={() => onSaleLabelClick(text)}
                                title={text}
                            >
                                {preview}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[520px]">
                            <p>Нажмите чтобы посмотреть полный SEO заголовок</p>
                        </TooltipContent>
                    </Tooltip>
                );
            }

            return <span className="text-sm">{text}</span>;
        },
    },
    {
        id: "coverAlt",
        accessorFn: row => row.coverAlt?.ru ?? "",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Альтер-ое название обложки
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            );
        },
        cell: ({row}) => (
            <div className="capitalize">{row.original.coverAlt?.ru}</div>
        ),
    },
    {
        id: "description",
        accessorFn: row => row.description?.ru ?? "",
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
        accessorKey: "seoDescription.ru",
        header: () => <div className="text-left">SEO описание</div>,
        cell: ({row}) => {
            const text = row.original.seoDescription?.ru || "—";
            if (text === "—") return text;

            const preview = text.length > 30 ? text.slice(0, 30) + "..." : text;

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span
                            className="cursor-pointer text-sm max-w-[320px] truncate inline-block align-top"
                            onClick={() => onSaleLabelClick(text)}
                            title={text}
                        >
                            {preview}
                    </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[520px]">
                        <p>Нажмите чтобы посмотреть полное SEO описание</p>
                    </TooltipContent>
                </Tooltip>
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
            const alt: string = row.original.coverAlt?.ru ?? "";
            const imageUrl = `${IMG_BASE}/${cover}`;

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className="relative w-16 h-16 rounded overflow-hidden cursor-pointer"
                            onClick={() =>
                                onImageClick({ cover, alt: { ru: alt } })
                            }
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
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onGallery(payment._id)}>
                            <Images className="mr-2 h-4 w-4 hover:text-popover"/>
                            Посмотреть галерею
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditPortfolio(payment)}>
                            <Edit2 className="mr-2 h-4 w-4 hover:text-popover""/>
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onRequestDelete(payment._id)}>
                            <Trash2 className="mr-2 h-4 w-4 hover:text-popover"/>
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]