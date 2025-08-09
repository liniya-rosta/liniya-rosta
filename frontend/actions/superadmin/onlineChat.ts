import {ChatFilters, ChatResponse, ChatSession} from "@/src/lib/types";
import kyAPI from "@/src/lib/kyAPI";

export const fetchAllChats = async (filters: ChatFilters = {}) => {
    const searchParams: Record<string, string> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams[key] = value instanceof Date
                ? value.toISOString()
                : String(value);
        }
    });

    console.log(searchParams)

    return await kyAPI
        .get("superadmin/online-chat", { searchParams })
        .json<ChatResponse>();
};

export const fetchChatById = async (chatId: string) => {
    return await kyAPI
        .get(`superadmin/online-chat/${chatId}`)
        .json<ChatSession>();
};

export const updateChatStatus = async (chatId: string, status: string) => {
    return await kyAPI
        .patch(`superadmin/online-chat/${chatId}`, {
            json: { status },
        })
        .json<ChatResponse>();
};

export const deleteChat = async (chatId: string) => {
    await kyAPI.delete(`superadmin/online-chat/${chatId}`);
};