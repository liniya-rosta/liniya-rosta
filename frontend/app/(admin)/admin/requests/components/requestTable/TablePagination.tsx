"use client"

import React, {useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {fetchAllRequests} from "@/actions/superadmin/requests";

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

    const handleNext = () => {
        if (page < lastPage) goToPage(page + 1).then();
    };

    return (
        <>
            <div className="flex items-center justify-end space-x-2 py-2 flex-wrap">
                <span className="px-2 text-sm">{totalItems} заявок</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={page === 1}
                >
                    Назад
                </Button>

                <span className="px-2 text-sm">
                {page} из {lastPage || "…"}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={page === lastPage}
                >
                    Далее
                </Button>
            </div>
        </>
    );
};

export default TablePagination;