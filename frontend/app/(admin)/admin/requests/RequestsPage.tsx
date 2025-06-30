'use client'

import React, {useEffect} from 'react';
import {FetchRequestsResponse} from "@/lib/types";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {DataTable} from "@/app/(admin)/admin/requests/components/requestTable/Data-table";
import {columns} from "@/app/(admin)/admin/requests/components/requestTable/Columns";

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
                const response: FetchRequestsResponse = await fetchAllRequests({ page: 1 });
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

    return (
        <div>
            <DataTable columns={columns} data={requests} error={fetchAllError} loading={fetchAllLoading}/>
        </div>
    );
};

export default RequestsPage;