import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import React from "react";
import {Table as TanStackTable} from "@tanstack/react-table";
import {PortfolioItemPreview} from "@/lib/types";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";

interface Props {
    table: TanStackTable<PortfolioItemPreview>,
    showConfirm: (value: boolean) => void;
    setGalleryDelete: (value: boolean) => void;
}

const columnLabels: Record<string, string> = {
    index: "№",
    coverAlt: "Альтер-ое название обложки",
    description: "Описание",
    galleryCount: "Кол-во изображений",
    cover: "Обложка",
    actions: "Меню",
};

const CustomTableHeader: React.FC<Props> = ({table, showConfirm, setGalleryDelete}) => {
    const { selectedToDelete } = useSuperAdminPortfolioStore()

    return (
        <div className="flex justify-between gap-4 py-4 flex-wrap items-center">
            <div>
                <Input
                    placeholder="Фильтр по альтер-му названию..."
                    value={(table.getColumn("coverAlt")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("coverAlt")?.setFilterValue(event.target.value)
                    }
                    className="w-full max-w-2xl min-w-[300px]"
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