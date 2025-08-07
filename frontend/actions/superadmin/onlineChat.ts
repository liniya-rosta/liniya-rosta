import axiosAPI from "@/src/lib/axiosAPI";
import {ChatFilters, ChatResponse} from "@/src/lib/types";

export const fetchAllChats = async (filters: ChatFilters = {}) => {
    const response = await axiosAPI.get<ChatResponse>("/superadmin/online-chat", {
        params: filters,
    });

    return response.data;
};

export const fetchChatById = async (chatId: string) => {
    const response = await axiosAPI(`/superadmin/online-chat/${chatId}`);
    return response.data;
};

export const updateChatStatus = async (chatId: string, status: string) => {
    const response = await axiosAPI.patch(`/superadmin/online-chat/${chatId}`, { status });
    return response.data;
};

export const deleteChat = async (chatId: string) => {
    await axiosAPI.delete(`/superadmin/online-chat/${chatId}`);
};