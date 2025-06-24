import {User} from "@/lib/types";
import {create} from "zustand/react";

interface AdminsState {
    admins: User[];
    adminsLoading: boolean;
    adminsError: string | null;

    editAdmin: User | null;
    editAdminLoading: boolean;
    editAdminError: string | null;

    setAdmins: (admins: User[]) => void;
    setAdminsLoading: (loading: boolean) => void;
    setAdminsError: (error: string | null) => void;

    setEditAdmin: (admin: User) => void;
    setEditAdminLoading: (loading: boolean) => void;
    setEditAdminError: (error: string | null) => void;
}

export const useSuperadminAdminsStore = create<AdminsState>((set) => ({
    admins: [],
    adminsLoading: true,
    adminsError: null,

    editAdmin: null,
    editAdminLoading: false,
    editAdminError: null,

    setAdmins: (admins) => set({admins}),
    setAdminsLoading: (loading) => set({adminsLoading: loading}),
    setAdminsError: (error) => set({adminsError: error}),

    setEditAdmin: (admin) => set({editAdmin: admin}),
    setEditAdminLoading: (loading) => set({editAdminLoading: loading}),
    setEditAdminError: (error) => set({editAdminError: error}),
}));