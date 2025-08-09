'use client';

import React, {useEffect, useState} from 'react';
import {User} from "@/src/lib/types";
import {getAllAdmins} from "@/actions/superadmin/admins";
import Admins from "@/src/app/(admin)/admin/admins/Admins";
import {handleKyError} from "@/src/lib/handleKyError";

const AdminsPage = () => {
    const [admins, setAdmins] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await getAllAdmins();
                setAdmins(data);
            } catch (e) {
                const msg = await handleKyError(e, 'Ошибка при получении админов');
                setError(msg);
            }
        };

        void fetchAdmins();
    }, []);

    return <Admins data={admins} error={error}/>;
};

export default AdminsPage;