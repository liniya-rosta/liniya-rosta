import axiosAPI from "@/src/lib/axiosAPI";
import {ChatSession} from "@/src/lib/types";

export const fetchAllChats = async () => {
    const response = await axiosAPI<ChatSession[]>("/superadmin/online-chat");
    return response.data;
}

export const fetchChatById = async (chatId: string) => {
    const response = await axiosAPI(`/superadmin/online-chat/${chatId}`);
    return response.data;
}

export const deleteChat = async (chatId: string) => {
    await axiosAPI(`/online-chat/${chatId}`);
}