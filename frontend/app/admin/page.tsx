import React from 'react';
import {IRequest} from "@/lib/types";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import RequestsTable from "@/app/admin/requests/RequestsTable";

const Page = async () => {
    let requests: IRequest[] = [];
    let requestsFetchError: string | null = null;

    try {
        requests = await fetchAllRequests();
    } catch (e) {
        requestsFetchError = e instanceof Error ? e.message : 'Ошибка при получении заявок';
    }

    return (
        <div>
            <RequestsTable initialData={requests} error={requestsFetchError}/>
        </div>
    );
};

export default Page;