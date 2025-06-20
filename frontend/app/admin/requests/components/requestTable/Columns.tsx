import {ColumnDef} from "@tanstack/react-table"
import {IRequest} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";

export const columns: ColumnDef<IRequest>[] = [
    {
        accessorKey: "name",
        header: "Имя",
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            return (
                <span className={`font-medium mr-[15px]`}>
          {name}
        </span>
            )
        },
        filterFn: "includesString",
    },
    {
        accessorKey: "phone",
        header: "Номер телефона",
    },
    {
        accessorKey: "email",
        header: "Почта",
    },
    {
        accessorKey: "commentOfManager",
        header: "Комментарий",
    },
    {
        accessorKey: "status",
        header: () => (
            <>
                Статус
            </>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <span className={`font-medium ${
                    status === 'Новая' ? 'text-green-600' :
                        status === 'В работе' ? 'text-yellow-500' :
                            status === 'Завершена' ? 'text-blue-500' :
                                status === 'Отклонена' ? 'text-red-500' :
                                    ''
                }`}>
          {status}
        </span>
            )
        },
        filterFn: "equals"
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата создания
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата обновления
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
]
