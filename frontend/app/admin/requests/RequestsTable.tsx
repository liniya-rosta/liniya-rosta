'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import React, {useEffect} from 'react';
import {useAdminRequestsStore} from "@/store/superadmin/adminRequestsStore";
import {fetchAllRequests} from "@/actions/superadmin/requests";
import useUserStore from "@/store/usersStore";
import {useRouter} from "next/navigation";

const RequestsTable = () => {
    const {user} = useUserStore();
    const router = useRouter();
    const {requests,
        // fetchAllLoading,
        setFetchAllLoading,
        // fetchAllError,
        setFetchAllError,
        setRequests} = useAdminRequestsStore();

    useEffect(() => {
        if (!user) {
            router.push('/admin/login');
            return;
        }

        const fetchData = async () => {
            setFetchAllLoading(true);
            try {
                const data = await fetchAllRequests();
                setRequests(data);
                setFetchAllError(null);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Ошибка при получении заявок';
                setFetchAllError(errorMessage);
            } finally {
                setFetchAllLoading(false);
            }
        };

            fetchData().then();

    }, [user,router, setRequests, setFetchAllLoading, setFetchAllError]);

    if (!user) return null;

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