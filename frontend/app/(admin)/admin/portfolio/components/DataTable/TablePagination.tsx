import {Button} from "@/components/ui/button";
import React from "react";
import {Table as TanStackTable} from "@tanstack/table-core";
import {PortfolioItemPreview} from "@/lib/types";

interface Props {
    table: TanStackTable<PortfolioItemPreview>,
}

const TablePagination: React.FC<Props> = ({table}) => {
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Назад
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Далее
                </Button>
            </div>
        </div>
    )
}

export default TablePagination