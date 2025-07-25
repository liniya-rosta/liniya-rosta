'use client';

import React, {useEffect} from 'react';
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import CreateAdmin from "@/src/app/(admin)/admin/admins/components/CreateAdmin";
import {User} from "@/src/lib/types";
import LoadingFullScreen from "@/src/components/ui/Loading/LoadingFullScreen";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import AdminsTable from "@/src/app/(admin)/admin/admins/components/AdminsTable";
import {Dialog} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {Plus} from "lucide-react";

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

    const [isOpen, setIsOpen] = React.useState(false);


    useEffect(() => {
        if (data) setAdmins(data);
        setAdminsError(error);
        setAdminsLoading(false);
    }, [data, error, setAdmins, setAdminsError, setAdminsLoading]);

    if (adminsLoading) return <LoadingFullScreen/>;
    if (adminsError) return <ErrorMsg error={adminsError}/>;

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground text-center sm:text-left">
                    Управление админами
                </h1>

                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="flex items-center w-full sm:w-auto cursor-pointer"
                    disabled={adminsLoading}
                >
                    <Plus className="h-5 w-5"/>
                    Создать админа
                </Button>

            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <CreateAdmin closeModal={() => setIsOpen(false)}/>
            </Dialog>
            <AdminsTable/>
        </>
    );
};

export default Admins;