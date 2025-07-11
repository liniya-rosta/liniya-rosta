import {ColumnDef} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {Button} from "@/src/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import React from "react";
import {Checkbox} from "@/src/components/ui/checkbox";
import {Service} from "@/lib/types";

export const getColumns = (
    onRequestDelete: (id: string) => void,
    onEdit: (id: string) => void,
): ColumnDef<Service>[] => [
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
        cell: ({ row, table }) => {
            const flatRows = table.getRowModel().flatRows;
            const originalIndex = flatRows.findIndex(r => r.id === row.id);
            return <div>{originalIndex + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Название услуги
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("title")}</div>
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
                        <DropdownMenuItem onClick={() => onEdit(payment._id)}>
                            Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRequestDelete(payment._id)}>
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]