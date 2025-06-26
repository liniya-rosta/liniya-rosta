import {Button} from "@/components/ui/button";
import React from "react";
import {Table as TanStackTable} from "@tanstack/table-core";
import {PortfolioItemPreview} from "@/lib/types";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface Props {
    table: TanStackTable<PortfolioItemPreview>,
}

const TablePagination: React.FC<Props> = ({table}) => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    return (
        <div className="flex items-center justify-end space-x-2 py-4 mb-10">
      <span className="text-sm">
        Страница {currentPage + 1} из {totalPages}
      </span>
            <div className="space-x-2">
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
                    <TooltipContent>
                        На первую страницу
                    </TooltipContent>
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
                    <TooltipContent>
                        На последнюю страницу
                    </TooltipContent>
                </Tooltip>

            </div>
        </div>
    );
};

export default TablePagination