import { create } from 'zustand'
import {ContactDataDTO} from "@/lib/types";

interface ContactState {
    contactData: ContactDataDTO | null
    setContactData: (data: ContactDataDTO) => void
}

export const useContactStore = create<ContactState>((set) => ({
    contactData: null,
    setContactData: (data) => {
        set({ contactData: data })
    },
}))