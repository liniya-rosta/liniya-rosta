import {create} from 'zustand';
import {Contact} from '@/lib/types';

interface ContactState {
    contact: Contact | null;
    fetchContactLoading: boolean;
    fetchContactError: string | null;
    setContact: (contact: Contact) => void;
    setFetchContactLoading: (loading: boolean) => void;
    setFetchContactError: (error: string | null) => void;
}

export const useContactStore = create<ContactState>((set) => ({
    contact: null,
    fetchContactLoading: true,
    fetchContactError: null,
    setContact: (contact) => set({contact}),
    setFetchContactLoading: (loading) => set({fetchContactLoading: loading}),
    setFetchContactError: (error) => set({fetchContactError: error})
}));