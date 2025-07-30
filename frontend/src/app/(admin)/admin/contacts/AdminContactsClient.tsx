'use client';

import React, {useEffect} from 'react';
import {Contact} from '@/src/lib/types';
import Loading from '@/src/components/ui/Loading/Loading';
import ErrorMsg from '@/src/components/ui/ErrorMsg';
import AdminContactForm from './components/AdminContactForm';
import {useSuperadminContactsStore} from "@/store/superadmin/superadminContactsStore";

interface Props {
    data: Contact | null;
    error: string | null;
}

const AdminContactsClient: React.FC<Props> = ({data, error}) => {
    const {
        contact,
        setContact,
        fetchLoading,
        setFetchLoading,
        fetchError,
        setFetchError,
        setUpdateLoading
    } =
        useSuperadminContactsStore();

    useEffect(() => {
        if (data) setContact(data);
        setFetchError(error);
        setFetchLoading(false);
        setUpdateLoading(false);
    }, [data, error, setContact, setFetchError, setFetchLoading, setUpdateLoading]);

    if (fetchLoading) return <Loading/>;
    if (fetchError) return <ErrorMsg error={fetchError}/>;

    return (
        <div>
            <h1 className="text-23-30-1_5 font-bold text-center sm:text-left">
                Управление контактной информацией
            </h1>
            {contact && <AdminContactForm contact={contact}/>}
        </div>
    );
};

export default AdminContactsClient;
