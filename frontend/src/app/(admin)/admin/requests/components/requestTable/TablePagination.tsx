"use client"

import React, {useEffect} from 'react';
import {Button} from "@/src/components/ui/button";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/src/components/ui/tooltip";

const TablePagination = () => {
    const {
        page,
        lastPage,
        totalItems,
        setRequests,
        setPage,
        setLastPage,
        setTotalItems,
        status,
        search,
        dateTo,
        dateFrom,
        viewArchived,
    } = useAdminRequestsStore();

    const goToPage = async (targetPage: number) => {
        const res = await fetchAllRequests({
            page: targetPage,
            status,
            search,
            dateTo,
            dateFrom,
            archived: viewArchived,
        })
        setPage(targetPage);
        setRequests(res.data);
        setLastPage(res.totalPages);
        setTotalItems(res.totalItems);
    };

    useEffect(() => {
        goToPage(1).then();
    }, [status, search, dateTo, dateFrom, viewArchived]);

    const handlePrev = () => {
        if (page > 1) goToPage(page - 1).then();
    };

    const handleLast = () => {
        goToPage(lastPage).then();
    }

    const handleNext = () => {
        if (page < lastPage) goToPage(page + 1).then();
    };

    const handleFirst = () => {
        goToPage(1).then()
    }

    return (
        <>
            <div className="flex items-center justify-center md:justify-end space-x-2 py-2 flex-wrap">
                <span className="px-2 text-sm">
                Страница {page} из {lastPage || "…"}
                </span>
                <div className="flex items-center justify-center md:justify-end space-x-2 py-2 flex-wrap">
                    <span className="px-2 text-sm">Всего заявок: {totalItems}</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleFirst}
                                disabled={page === 1}
                            >
                                ««
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>На первую страницу</TooltipContent>
                    </Tooltip>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={page === 1}
                    >
                        Назад
                    </Button>


                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={page === lastPage}
                    >
                        Далее
                    </Button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLast}
                                disabled={page === lastPage}
                            >
                                »»
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>На последнюю страницу</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </>
    );
};

export default TablePagination;
