'use client';

import React, {useEffect, useState} from 'react';
import {User} from "@/lib/types";
import {getAllAdmins} from "@/actions/superadmin/admins";
import {AxiosError} from "axios";
import Admins from "@/app/(admin)/admin/admins/Admins";

const AdminsPage = () => {
    const [admins, setAdmins] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const data = await getAllAdmins();
                setAdmins(data);
            } catch (e) {
                if (e instanceof AxiosError) {
                    setError(e.response?.data?.error ?? "Ошибка при загрузке админов");
                } else {
                    setError("Неизвестная ошибка");
                }
            }
        };

        fetchAdmins();
    }, []);

    return <Admins data={admins} error={error} />;
};

export default AdminsPage;