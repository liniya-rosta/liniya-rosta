import {Column} from "@tanstack/react-table";
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


interface Props<TData> {
    column: Column<TData, unknown>;
}

const StatusFilter = <TData, >({column}: Props<TData>) => {
    const currentValue = column.getFilterValue() as string | undefined

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Фильтр по статусу:</span>
            <Select
                value={currentValue ?? "all"}
                onValueChange={(value) => {
                    column.setFilterValue(value === "all" ? undefined : value)
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Все"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="Новая">Новая</SelectItem>
                    <SelectItem value="В работе">В работе</SelectItem>
                    <SelectItem value="Завершена">Завершена</SelectItem>
                    <SelectItem value="Отклонена">Отклонена</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
};


export default StatusFilter;
