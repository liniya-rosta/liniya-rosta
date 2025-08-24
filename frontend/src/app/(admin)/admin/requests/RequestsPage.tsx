'use client'

import React, {useCallback, useEffect} from 'react';
import {FetchRequestsResponse} from "@/src/lib/types";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {DataTable} from "@/src/app/(admin)/admin/requests/components/requestTable/Data-table";
import {columns} from "@/src/app/(admin)/admin/requests/components/requestTable/Columns";
import DataSkeleton from "@/src/components/shared/DataSkeleton";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import {handleKyError} from "@/src/lib/handleKyError";

const RequestsPage = () => {
    const {
        requests,
        setRequests,
        fetchAllError,
        fetchAllLoading,
        setFetchAllError,
        setFetchAllLoading,
        setPage,
        setLastPage,
        setTotalItems,
    } = useAdminRequestsStore()

    const getDataFetch = useCallback(async () => {
        setFetchAllLoading(true);
        setFetchAllError(null);

        try {
            const response: FetchRequestsResponse = await fetchAllRequests({ page: 1, archived: false });
            setRequests(response.data);
            setPage(1);
            setLastPage(response.totalPages);
            setTotalItems(response.totalItems);
        } catch (e) {
            const msg = await handleKyError(e, "Произошла ошибка при получении заявок");
            setFetchAllError(msg);
        } finally {
            setFetchAllLoading(false);
        }
    }, [setFetchAllError, setFetchAllLoading, setLastPage, setPage, setRequests, setTotalItems]);

    useEffect(() => {
        void getDataFetch();
    }, [getDataFetch]);

    if (fetchAllLoading) return <DataSkeleton/>
    if (fetchAllError) return <ErrorMsg error={fetchAllError}/>

    return (
        <DataTable columns={columns} data={requests} error={fetchAllError} loading={fetchAllLoading}/>
    );
};

export default RequestsPage;