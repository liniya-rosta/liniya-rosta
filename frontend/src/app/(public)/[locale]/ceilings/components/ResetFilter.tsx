import React from 'react';
import {Button} from "@/src/components/ui/button";
import {X} from "lucide-react";
import {ProductResponse} from "@/src/lib/types";
import {useTranslations} from "next-intl";

interface Props {
    data: ProductResponse | null;
    categoryId: string;
    handleResetFilters: () => void;
}

const ResetFilter: React.FC<Props> = ({data, categoryId, handleResetFilters}) => {
    const tCeilings = useTranslations("CeilingsPage");

    return (
        <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
                {tCeilings("filter.countProductsTitle")} <span
                className="font-semibold text-foreground">{data?.total}</span>
            </p>
            {categoryId !== 'all' && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="gap-1"
                >
                    <X className="h-4 w-4"/>
                    {tCeilings("filter.removeFilter")}
                </Button>
            )}
        </div>
    );
};

export default ResetFilter;