import React from 'react';
import {Table as TanStackTable} from "@tanstack/table-core/";
import {Post} from "@/lib/types";
import {Button} from "@/components/ui/button";

interface Props {
    table: TanStackTable<Post>,
}

const TablePagination: React.FC<Props> = ({table}) => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
           <span className="text-sm text-muted-foreground mb-2">
                    Страница <span className="font-medium">{currentPage + 1}</span> из{" "}
               <span className="font-medium">{totalPages}</span>
           </span>
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
    );
};

export default TablePagination;