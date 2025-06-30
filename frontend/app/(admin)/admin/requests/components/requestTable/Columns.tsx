import {ColumnDef} from "@tanstack/react-table"
import {IRequest} from "@/lib/types";
import {ArrowUpDown} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import dayjs from "dayjs";

export const columns: ColumnDef<IRequest>[] = [
    {
        accessorKey: "_id",
        accessorFn: (row) => row._id,
    header: ({ table }) => (
    <Checkbox
        checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
    />
),
    cell: ({ row }) => (
    <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
    />
),
    enableSorting: false,
    enableHiding: false,
},
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
        header: "Статус",
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
                <div
                    className="flex cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата создания
                    <ArrowUpDown className="ml-2 h-4 w-4 mt-0.5" />
                </div>
            )
        },
        cell: ({ row }) => {
            return dayjs(row.original.createdAt).format("DD-MM-YYYY HH:mm");
        },
        filterFn: (row, columnId, filterValue: [string, string]) => {
            const raw = row.getValue(columnId) as string;
            const value = new Date(raw);
            const [from, to] = filterValue;

            const valueDateOnly = new Date(value.getFullYear(), value.getMonth(), value.getDate());

            const fromDate = from ? new Date(from + "T00:00:00") : null;
            const toDate = to ? new Date(to + "T00:00:00") : null;

            return (
                (!fromDate || valueDateOnly >= fromDate) &&
                (!toDate || valueDateOnly <= toDate)
            );
        },
        meta: {
            title: "Дата создания",
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <div
                    className="flex cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата обновления
                    <ArrowUpDown className="ml-2 h-4 w-4 mt-0.5" />
                </div>
            )
        },
        cell: ({ row }) => {
            return dayjs(row.original.createdAt).format("DD-MM-YYYY HH:mm");
        },
        meta: {
            title: "Дата обновления",
        },
    },
]
