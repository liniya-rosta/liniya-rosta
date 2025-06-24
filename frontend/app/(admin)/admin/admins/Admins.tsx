'use client';

import React, {useEffect} from 'react';
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import {User} from "@/lib/types";

interface Props {
    data: User[] | null;
    error: string | null;
}

const Admins: React.FC<Props> = ({data, error}) => {

    const {
        admins,
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

    }, [data, error]);


    return (
        <div>
            {
                admins.map(admin => (
                    <p key={admin._id}>{admin.email}</p>
                ))
            }

        </div>
    );
};

export default Admins;