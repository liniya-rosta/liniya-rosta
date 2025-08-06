import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import {fetchAllChats, fetchChatById} from "@/actions/superadmin/onlineChat";
import {isAxiosError} from "axios";
import {useState} from "react";
import {ChatMessage} from "@/src/lib/types";

const useAdminChatFetcher = () => {
    const {
        allChats,
        setChats,
        setFetchChatLoading,
        setFetchChatError,
        addChat
    } = useAdminChatStore();

    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const fetchData = async () => {
        try {
            const data = await fetchAllChats();
            setChats(data);
        } catch (err) {
            let errorMessage = "Ошибка при получении данных";
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setFetchChatError(errorMessage);
        } finally {
            setFetchChatLoading(false)
        }
    }

    const fetchOneChat = async (chatId: string) => {
        try {
            const data = await fetchChatById(chatId);
            setMessages(data.messages);
        } catch (err) {
            let errorMessage = "Ошибка при получении данных";
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setFetchChatError(errorMessage);
        }
    }

    return {
        allChats,
        messages,
        addChat,
        setChats,
        setMessages,
        fetchData,
        fetchOneChat,
    }
}

export default useAdminChatFetcher;