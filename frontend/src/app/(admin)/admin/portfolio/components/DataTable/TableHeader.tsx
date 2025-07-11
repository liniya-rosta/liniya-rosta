import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import React, {useState} from "react";
import {Table as TanStackTable} from "@tanstack/react-table";
import {PortfolioItemPreview} from "@/lib/types";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";

interface Props {
    table: TanStackTable<PortfolioItemPreview>,
    showConfirm: (value: boolean) => void;
    setGalleryDelete: (value: boolean) => void;
    onFilterChange: (column: string, value: string) => void;
}

const columnLabels: Record<string, string> = {
    index: "№",
    coverAlt: "Альтер-ое название обложки",
    description: "Описание",
    galleryCount: "Кол-во изображений",
    cover: "Обложка",
    actions: "Меню",
};

const filterOptions = [
    { label: "По alt обложки", value: "coverAlt" },
    { label: "По описанию", value: "description" },
];

const CustomTableHeader: React.FC<Props> = ({table, showConfirm, setGalleryDelete, onFilterChange}) => {
    const { selectedToDelete } = useSuperAdminPortfolioStore()
    const [filterColumn, setFilterColumn] = useState("coverAlt");
    const filterValue = (table.getColumn(filterColumn)?.getFilterValue() as string) ?? "";

    return (
        <div className="flex justify-between gap-4 py-4 flex-wrap items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={filterColumn} onValueChange={(value) => {
                    table.getColumn(filterColumn)?.setFilterValue("");
                    setFilterColumn(value);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Фильтр по колонке" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Поиск..."
                    value={filterValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        table.getColumn(filterColumn)?.setFilterValue(value);
                        onFilterChange(filterColumn, value);
                    }}
                    className="w-full sm:w-[300px]"
                />
            </div>


            <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={!selectedToDelete || selectedToDelete.length < 1}
                        onClick={() => {
                            setGalleryDelete(false);
                            showConfirm(true);
                        }}
                    >Удалить выбранные {selectedToDelete?.length} элементы</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Показать на странице <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {[5, 10, 20, 30, 50].map((pageSize) => (
                            <DropdownMenuItem
                                key={pageSize}
                                onSelect={() => table.setPageSize(pageSize)}
                            >
                                {pageSize} элементов
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Колонки <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {columnLabels[column.id] ?? column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default CustomTableHeader;