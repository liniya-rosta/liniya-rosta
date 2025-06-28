import React from 'react';
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {Table} from "@tanstack/react-table";
import {IRequest} from "@/lib/types";

interface Props {
    table: Table<IRequest>;
}

const ColumnVisibility: React.FC<Props> = ({table}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Колонки
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {table
                    .getAllColumns()
                    .filter(
                        (column) => column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(Boolean(value))
                                }
                            >
                                {typeof column.columnDef.header === 'string'
                                    ? column.columnDef.header
                                    : (column.columnDef.meta as { title: string })?.title}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ColumnVisibility;