import React, {useEffect, useState} from 'react';
import {Input} from "@/src/components/ui/input";
import {usePortfolioStore} from "@/store/portfolioItemStore";

const SearchByAltGallery = () => {
    const { setCoverAlt, coverAlt } = usePortfolioStore();
    const [value, setValue] = useState(coverAlt ?? "");

    useEffect(() => {
        setCoverAlt(value);
    }, [value, setCoverAlt]);

    return (
        <div className="flex items-center min-w-[220px] mb-4">
            <Input
                placeholder="Поиск по названию"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="max-w-sm"
            />
        </div>
    );
};

export default SearchByAltGallery;