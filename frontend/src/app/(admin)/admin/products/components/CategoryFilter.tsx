import { Column } from "@tanstack/react-table";
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Category } from "@/src/lib/types";

interface CategoryFilterProps<TData> {
    column?: Column<TData, unknown>;
    categories: Category[];
}

const CategoryFilter = <TData, >({ column, categories }: CategoryFilterProps<TData>) => {
    const currentValue = column?.getFilterValue() as string | undefined;

    return (
        <div className="flex items-center gap-2">
            <Select
                value={currentValue ?? "all"}
                onValueChange={(value) => {
                    if (column) {
                        column.setFilterValue(value === "all" ? undefined : value);
                    }
                }}
                disabled={!column}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                            {category.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default CategoryFilter;