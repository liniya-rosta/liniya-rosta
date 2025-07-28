import {User} from "@/src/lib/types";
import {create} from "zustand/react";

interface AdminsState {
    admins: User[];
    adminsLoading: boolean;
    adminsError: string | null;

    editAdmin: User | null;
    editAdminLoading: boolean;
    editAdminError: string | null;

    deleteAdmin: User | null;
    deleteAdminLoading: boolean;
    deleteAdminError: string | null;

    createAdminError: string | null;

    setAdmins: (admins: User[]) => void;
    setAdminsLoading: (loading: boolean) => void;
    setAdminsError: (error: string | null) => void;

    setEditAdmin: (admin: User | null) => void;
    setEditAdminLoading: (loading: boolean) => void;
    setEditAdminError: (error: string | null) => void;

    setDeleteAdmin: (user: User | null) => void;
    setDeleteAdminLoading: (loading: boolean) => void;
    setDeleteAdminError: (error: string | null) => void;

    setCreateAdminError: (error: string | null) => void;
}

export const useSuperadminAdminsStore = create<AdminsState>((set) => ({
    admins: [],
    adminsLoading: true,
    adminsError: null,

    editAdmin: null,
    editAdminLoading: false,
    editAdminError: null,

    deleteAdmin: null,
    deleteAdminLoading: false,
    deleteAdminError: null,

    createAdminError: null,

    setAdmins: (admins) => set({admins}),
    setAdminsLoading: (loading) => set({adminsLoading: loading}),
    setAdminsError: (error) => set({adminsError: error}),

    setEditAdmin: (admin) => set({editAdmin: admin}),
    setEditAdminLoading: (loading) => set({editAdminLoading: loading}),
    setEditAdminError: (error) => set({editAdminError: error}),

    setDeleteAdminLoading: (loading) => set({deleteAdminLoading: loading}),
    setDeleteAdminError: (error) => set({deleteAdminError: error}),
    setDeleteAdmin: (admin) => set({deleteAdmin: admin}),

    setCreateAdminError: (error) => set({createAdminError: error}),
}));