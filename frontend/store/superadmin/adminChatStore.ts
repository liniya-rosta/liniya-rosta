import {ChatSession} from "@/src/lib/types";
import {create} from "zustand/react";

interface AdminChatState {
    allChats: ChatSession[];
    oneChat: ChatSession | null;
    fetchChatLoading: boolean;
    deleteChatLoading: boolean;
    fetchChatError: string | null;
    selectedToDelete: string[],

    setChats: (data: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => void;
    setOneChat: (data: ChatSession) => void;
    setFetchChatLoading: (loading: boolean) => void;
    setDeleteChatLoading: (loading: boolean) => void;
    setFetchChatError: (error: string | null) => void;
    setSelectedToDelete: (selectedToDelete: string[]) => void;

    addChat: (chat: ChatSession) => void;
    updateChat: (chatId: string, updater: Partial<ChatSession>) => void;
    removeChat: (chatId: string) => void;
}

export const useAdminChatStore = create<AdminChatState>((set) => ({
    allChats: [],
    oneChat: null,
    fetchChatLoading: false,
    deleteChatLoading: false,
    fetchChatError: null,
    selectedToDelete: [],
    setChats: (data) =>
        set((state) => ({
            allChats: typeof data === "function" ? data(state.allChats) : data,
        })),

    setOneChat: (data) => set({ oneChat: data }),
    setFetchChatLoading: (loading) => set({ fetchChatLoading: loading }),
    setDeleteChatLoading: (loading) => set({ deleteChatLoading: loading }),
    setFetchChatError: (error) => set({ fetchChatError: error }),
    setSelectedToDelete: (ids) => set({selectedToDelete: ids}),

    addChat: (chat) =>
        set((state) => {
            if (state.allChats.some((c) => c._id === chat._id)) {
                return state;
            }
            return { allChats: [chat, ...state.allChats] };
        }),

    updateChat: (chatId, updater) =>
        set((state) => ({
            allChats: state.allChats.map((chat) =>
                chat._id === chatId ? { ...chat, ...updater } : chat
            ),
        })),

    removeChat: (chatId) =>
        set((state) => ({
            allChats: state.allChats.filter((chat) => chat._id !== chatId),
        })),
}))