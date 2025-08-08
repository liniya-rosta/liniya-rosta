import React, {useEffect, useState} from 'react';
import {Input} from "@/src/components/ui/input";
import { useAdminRequestsStore } from '@/store/superadmin/adminRequestsStore';

const SearchTable = () => {
    const { setSearch, search } = useAdminRequestsStore();
    const [value, setValue] = useState(search ?? "");

    useEffect(() => {
        setSearch(value);
    }, [value]);

    return (
        <div className="flex flex-col sm:flex-row items-center min-w-[220px] gap-2">
            <span className="md:hidden text-sm whitespace-nowrap">Поиск: </span>
            <Input
                placeholder="Поиск по имени"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );
};

export default SearchTable;