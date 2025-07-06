import React from 'react';
import {Table as TanStackTable} from "@tanstack/table-core/";
import {Post} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface Props {
    table: TanStackTable<Post>,
}

const TablePostPagination: React.FC<Props> = ({table}) => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-10">
            <span className="text-sm text-muted-foreground">
                Всего элементов: <span className="font-medium"></span>
            </span>

            <div className="flex flex-col items-center w-full sm:w-auto">
                 <span className="text-sm text-muted-foreground mb-2">
                     Страница <span className="font-medium">{currentPage + 1}</span> из{" "}
                     <span className="font-medium">{totalPages}</span>
                 </span>

                <div className="flex gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                ««
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>На первую страницу</TooltipContent>
                    </Tooltip>

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

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(totalPages - 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                »»
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>На последнюю страницу</TooltipContent>
                    </Tooltip>

                </div>
            </div>

        </div>
    );
};

export default TablePostPagination;