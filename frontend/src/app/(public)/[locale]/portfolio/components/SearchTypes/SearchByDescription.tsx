import React, {useEffect, useState} from 'react';
import {Input} from "@/src/components/ui/input";
import {usePortfolioStore} from "@/store/portfolioItemStore";

const SearchByDescription = () => {
    const { setDescription, description } = usePortfolioStore();
    const [value, setValue] = useState(description ?? "");

    useEffect(() => {
        setDescription(value);
    }, [value, setDescription]);

    return (
        <div className="flex items-center min-w-[220px] mb-4">
            <Input
                placeholder="Поиск по описанию"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );
};

export default SearchByDescription;