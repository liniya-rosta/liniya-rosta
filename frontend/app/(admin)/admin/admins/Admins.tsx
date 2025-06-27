'use client';

import React, {useEffect} from 'react';
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import {User} from "@/lib/types";
import LoadingFullScreen from "@/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/components/ui/ErrorMsg";
import AdminsTable from "@/app/(admin)/admin/admins/components/AdminsTable";

interface Props {
    data: User[] | null;
    error: string | null;
}

const Admins: React.FC<Props> = ({data, error}) => {
    const {
        setAdmins,

        adminsLoading,
        setAdminsLoading,

        setAdminsError,
        adminsError,
    } = useSuperadminAdminsStore();

    useEffect(() => {
        if (data) setAdmins(data);
        setAdminsError(error);
        setAdminsLoading(false);
    }, [data, error, setAdmins, setAdminsError, setAdminsLoading]);

    if (adminsLoading) return <LoadingFullScreen/>;
    if (adminsError) return <ErrorMsg error={adminsError} label="админов"/>;

    return (
        <>
            <AdminsTable/>
        </>
    );
};

export default Admins;