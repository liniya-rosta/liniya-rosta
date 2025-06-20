'use client'

import React, {useEffect} from 'react';
import {IRequest} from "@/lib/types";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {DataTable} from "@/app/admin/requests/components/requestTable/Data-table";
import {columns} from "@/app/admin/requests/components/requestTable/Columns";
import dayjs from "dayjs";

const RequestsPage = () => {
    const {requests, setRequests, fetchAllError, fetchAllLoading, setFetchAllError,setFetchAllLoading} = useAdminRequestsStore()

    useEffect(() => {
        let fetchData: IRequest[] = []
        let error: string | null = null

        const getDataFetch = async () => {
            setFetchAllLoading(true);
            setFetchAllError(null);

            try {
                fetchData = await fetchAllRequests();
                const data = fetchData.map((item) => ({
                    ...item,
                    createdAt: dayjs(item.createdAt).format('DD-MM-YYYY HH:mm'),
                    updatedAt: dayjs(item.updatedAt).format('DD-MM-YYYY HH:mm'),
                }));
                setRequests(data.reverse());
                setFetchAllLoading(false);
            } catch (e) {
               error = e instanceof Error ? e.message : 'Произошла ошибка при получении заявок';
               setFetchAllError(error)
            } finally {
                setFetchAllLoading(false);
            }
        }
        getDataFetch().then()
    }, [setRequests, setFetchAllLoading, setFetchAllError]);

    return (
        <div className={`m-[20px]`}>
            <DataTable columns={columns} data={requests} error={fetchAllError} loading={fetchAllLoading} />
        </div>
    );
};

export default RequestsPage;