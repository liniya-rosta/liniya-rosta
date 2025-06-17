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
        <div className="flex items-center justify-between gap-4 py-4">
            <div>
                <Input
                    placeholder="Фильтр по описанию..."
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("description")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <Link href="/admin/portfolio/add-portfolio" className="block">
                <Button variant="outline" className="ml-auto">Создать портфолио</Button>
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Колонки <ChevronDown/>
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
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CustomTableHeader;