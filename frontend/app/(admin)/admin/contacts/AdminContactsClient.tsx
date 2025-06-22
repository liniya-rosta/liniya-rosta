'use client';

import React, {useEffect} from 'react';
import {Contact} from '@/lib/types';
import Loading from '@/components/ui/Loading/Loading';
import ErrorMsg from '@/components/ui/ErrorMsg';
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
    if (fetchError) return <ErrorMsg error={fetchError} label="контактов"/>;

    return (
        <div className="container mx-auto px-4 py-8">
            {contact && <AdminContactForm contact={contact}/>}
        </div>
    );
};

export default AdminContactsClient;
