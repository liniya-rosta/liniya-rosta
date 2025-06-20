import {Column} from "@tanstack/react-table";
import * as React from "react";

interface Props<TData> {
    column: Column<TData, unknown>;
}

const StatusFilter = <TData, >({column}: Props<TData>) => {

    return (
                <div className="flex items-center gap-2">
                    <span className="text-sm">Фильтр по статусу:</span>
                    <select
                        value={String(column.getFilterValue() ?? "")}
                        onChange={e => column.setFilterValue(e.target.value || undefined)}
                        className="border p-1 rounded"
                    >
                        <option value="">Все</option>
                        <option value="Новая">Новая</option>
                        <option value="В работе">В работе</option>
                        <option value="Завершена">Завершена</option>
                        <option value="Отклонена">Отклонена</option>
                    </select>
                </div>
    )
};


export default StatusFilter;
