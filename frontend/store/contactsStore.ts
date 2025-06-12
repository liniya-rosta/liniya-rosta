import {create} from 'zustand';
import {Contact} from '@/lib/types';

interface ContactState {
    contact: Contact | null;
    fetchLoading: boolean;
    fetchError: string | null;
    setContact: (contact: Contact) => void;
    setFetchLoading: (loading: boolean) => void;
    setFetchError: (error: string | null) => void;
}

export const useContactStore = create<ContactState>((set) => ({
    contact: null,
    fetchLoading: false,
    fetchError: null,
    setContact: (contact) => set({contact}),
    setFetchLoading: (loading) => set({fetchLoading: loading}),
    setFetchError: (error) => set({fetchError: error})
}));