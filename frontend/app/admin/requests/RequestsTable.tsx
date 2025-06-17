'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import React, {useEffect} from 'react';
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {IRequest} from "@/lib/types";

interface Props {
    initialData: IRequest[];
    error: string | null;
}

const RequestsTable: React.FC<Props> = ({ initialData, error }) => {
    const {requests,
        // fetchAllLoading,
        setFetchAllLoading,
        // fetchAllError,
        setFetchAllError,
        setRequests} = useAdminRequestsStore();

    useEffect(() => {
        setFetchAllLoading(false);
        setFetchAllError(error);
        if (initialData) setRequests(initialData)
    }, [initialData, error, setRequests, setFetchAllLoading, setFetchAllError]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead>Комментарий</TableHead>
                    <TableHead>Статус</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((req) => (
                    <TableRow key={req._id}>
                        <TableCell>{req.name}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.phone}</TableCell>
                        <TableCell>{req.commentOfManager}</TableCell>
                        <TableCell>{req.status}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default RequestsTable;