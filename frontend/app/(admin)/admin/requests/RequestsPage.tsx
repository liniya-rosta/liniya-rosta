'use client'

import React, {useEffect} from 'react';
import {FetchRequestsResponse} from "@/lib/types";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {DataTable} from "@/app/(admin)/admin/requests/components/requestTable/Data-table";
import {columns} from "@/app/(admin)/admin/requests/components/requestTable/Columns";
import DataSkeleton from "@/components/ui/Loading/DataSkeleton";
import ErrorMsg from "@/components/ui/ErrorMsg";

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

    useEffect(() => {
        const getDataFetch = async () => {
            setFetchAllLoading(true);
            setFetchAllError(null);

            try {
                const response: FetchRequestsResponse = await fetchAllRequests({ page: 1, archived: false });
                setRequests(response.data);
                setPage(1);
                setLastPage(response.totalPages);
                setTotalItems(response.totalItems);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Произошла ошибка при получении заявок';
                setFetchAllError(errorMessage);
            } finally {
                setFetchAllLoading(false);
            }
        };

        getDataFetch().then();
    }, []);

    if (fetchAllLoading) return <DataSkeleton/>
    if (fetchAllError) return <ErrorMsg error={fetchAllError}/>

    return (
            <DataTable columns={columns} data={requests} error={fetchAllError} loading={fetchAllLoading}/>
    );
};

export default RequestsPage;