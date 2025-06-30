"use client";

import {Input} from "@/components/ui/input";
import { useAdminRequestsStore } from "@/store/superadmin/adminRequestsStore";

export const DateFilter = () => {
    const { dateFrom, dateTo, setDateFrom, setDateTo } = useAdminRequestsStore();

    return (
        <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
                <span className="min-w-[60px] text-sm">Дата от</span>
                <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="От"
                /></label>
            <label className="flex items-center gap-1">
                <span className="min-w-[70px] text-sm">Дата до</span>
                <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="До"
                />
            </label>
        </div>
    );
};
