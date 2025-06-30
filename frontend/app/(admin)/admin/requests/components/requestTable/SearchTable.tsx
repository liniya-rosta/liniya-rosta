import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import { useAdminRequestsStore } from '@/store/superadmin/adminRequestsStore';

const SearchTable = () => {
    const { setSearch, search } = useAdminRequestsStore();
    const [value, setValue] = useState(search ?? "");

    useEffect(() => {
        setSearch(value);
    }, [value]);

    return (
        <div className="flex items-center py-4 min-w-[220px]">
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