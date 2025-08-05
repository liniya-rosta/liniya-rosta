import {ChatSession} from "@/src/lib/types";
import {create} from "zustand/react";

interface AdminChatState {
    allChats: ChatSession[];
    oneChat: ChatSession | null;
    fetchChatLoading: boolean;
    deleteChatLoading: boolean;
    fetchChatError: string | null;

    setChats: (data: ChatSession[]) => void;
    setOneChat: (data: ChatSession) => void;
    setFetchChatLoading: (loading: boolean) => void;
    setDeleteChatLoading: (loading: boolean) => void;
    setFetchChatError: (error: string) => void;
}

export const useAdminChatStore = create<AdminChatState>((set) => ({
    allChats: [],
    oneChat: null,
    fetchChatLoading: false,
    deleteChatLoading: false,
    fetchChatError: null,
    setChats: (data) => set({allChats: data}),
    setOneChat: (data) => set({oneChat: data}),
    setFetchChatLoading: (loading) => set({fetchChatLoading: loading}),
    setDeleteChatLoading: (loading: boolean) => set({deleteChatLoading: loading}),
    setFetchChatError: (error: string) => set({fetchChatError: error}),
}))