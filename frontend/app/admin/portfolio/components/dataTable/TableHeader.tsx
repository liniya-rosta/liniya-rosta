import {Input} from "@/components/ui/input";
import Link from "next/link";
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

interface Props {
    table: TanStackTable<PortfolioItemPreview>,
}

const CustomTableHeader: React.FC<Props> = ({table}) => {
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
                <Link href="/admin/portfolio/add-portfolio">
                    <Button variant="outline">Создать портфолио</Button>
                </Link>

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
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {
                                        typeof column.columnDef.header === "function"
                                            ? column.columnDef.header()?.props?.children ?? column.id
                                            : column.columnDef.header
                                    }
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default CustomTableHeader;