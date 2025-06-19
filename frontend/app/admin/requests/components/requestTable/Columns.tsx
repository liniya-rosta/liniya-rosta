import {ColumnDef} from "@tanstack/react-table"
import {IRequest} from "@/lib/types";

const statusLabels: Record<string, string> = {
    new: "Новая",
    in_progress: "В работе",
    done: "Завершена",
    rejected: "Отклонена",
}

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
        header: "Статус",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <span className={`font-medium ${
                    status === 'Новая' ? 'text-blue-500' :
                        status === 'В работе' ? 'text-yellow-500' :
                            status === 'Завершена' ? 'text-green-600' :
                                status === 'Отклонена' ? 'text-red-500' :
                                    ''
                }`}>
          {statusLabels[status] ?? status}
        </span>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Дата создания",
    },
    {
        accessorKey: "updatedAt",
        header: "Дата обновления",
    },
]
