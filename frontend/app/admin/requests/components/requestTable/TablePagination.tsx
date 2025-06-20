import React from 'react';
import {Button} from "@/components/ui/button";
import {Table} from "@tanstack/react-table";

interface Props<TData> {
    table: Table<TData>;
}

const TablePagination = <TData,> ({table}: Props<TData>) => {
    return (
        <>

                    <div className="flex items-center justify-end space-x-2 py-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {">"}
                        </Button>
                    </div>
        </>
    );
};

export default TablePagination;