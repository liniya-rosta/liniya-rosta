import {create} from 'zustand';
import {Contact} from '@/src/lib/types';

interface ContactState {
    contact: Contact | null;
    fetchLoading: boolean;
    updateLoading: boolean;
    fetchError: string | null;
    updateError: string | null;
    setContact: (contact: Contact) => void;
    setFetchLoading: (loading: boolean) => void;
    setUpdateLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;
    setUpdateError: (error: string | null) => void;
}

export const useSuperadminContactsStore = create<ContactState>((set) => ({
    contact: null,
    fetchLoading: true,
    updateLoading: false,
    fetchError: null,
    updateError: null,
    setContact: (contact) => set({contact}),
    setFetchLoading: (loading) => set({fetchLoading: loading}),
    setUpdateLoading: (loading) => set({updateLoading: loading}),
    setFetchError: (error) => set({fetchError: error}),
    setUpdateError: (error) => set({updateError: error}),
}));
