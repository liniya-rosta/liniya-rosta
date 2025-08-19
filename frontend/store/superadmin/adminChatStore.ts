import {Chat, ChatSession, PaginationMeta} from "@/src/lib/types";
import {create} from "zustand/react";

interface AdminChatState {
    allChats: ChatSession[];
    oneChatMessages: Chat | null;
    fetchChatLoading: boolean;
    deleteChatLoading: boolean;
    fetchChatError: string | null;
    selectedToDelete: string[],
    paginationChat: PaginationMeta | null;

    setChats: (data: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => void;
    setOneChatMessages: (messages: Chat | null | ((prev: Chat | null) => Chat | null)) => void;
    setFetchChatLoading: (loading: boolean) => void;
    setDeleteChatLoading: (loading: boolean) => void;
    setFetchChatError: (error: string | null) => void;
    setSelectedToDelete: (selectedToDelete: string[]) => void;
    setPaginationChat: (data: PaginationMeta) => void;
}

export const useAdminChatStore = create<AdminChatState>((set) => ({
    allChats: [],
    oneChatMessages: null,
    fetchChatLoading: false,
    deleteChatLoading: false,
    fetchChatError: null,
    selectedToDelete: [],
    paginationChat: null,

    setChats: (data) =>
        set((state) => ({
            allChats: typeof data === "function" ? data(state.allChats) : data,
        })),

    setOneChatMessages: (messages) => {
        if (typeof messages === "function") {
            set((state) => ({
                oneChatMessages: messages(state.oneChatMessages),
            }));
        } else {
            set({oneChatMessages: messages});
        }
    },

    setPaginationChat: (data) => set({paginationChat: data}),
    setFetchChatLoading: (loading) => set({ fetchChatLoading: loading }),
    setDeleteChatLoading: (loading) => set({ deleteChatLoading: loading }),
    setFetchChatError: (error) => set({ fetchChatError: error }),
    setSelectedToDelete: (ids) => set({selectedToDelete: ids}),
}))