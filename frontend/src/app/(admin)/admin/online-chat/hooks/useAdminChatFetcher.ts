import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import {fetchAllChats, fetchChatById} from "@/actions/superadmin/onlineChat";
import {isAxiosError} from "axios";
import {useState} from "react";
import {ChatFilters, ChatMessage} from "@/src/lib/types";
import {toast} from "react-toastify";
import {getAllAdmins} from "@/actions/superadmin/admins";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";

const useAdminChatFetcher = () => {
    const {
        allChats,
        fetchChatError,
        setChats,
        setFetchChatLoading,
        setFetchChatError,
        addChat
    } = useAdminChatStore();

    const {admins, setAdmins} = useSuperadminAdminsStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchData = async (filters?: ChatFilters, page?: number, limit?: number) => {
        setFetchChatError(null);

        if (page && page > totalPages) {
            return;
        }

        try {
            const data = await fetchAllChats({...filters, page, limit});
            setTotalPages(data.totalPages);

            if (page === 1) {
                setChats(data.items);
            } else {
                setChats((prev) =>
                    Array.from(
                        new Map(
                            [...prev, ...data.items].map(chat => [chat._id, chat])
                        ).values()
                    )
                );
            }

        } catch (err) {
            let errorMessage = "Ошибка при получении данных";
            if (err instanceof Error) {
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
            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setFetchChatError(errorMessage);
        }
    }

    const fetchAdmins = async () => {
        try {
            const admins = await getAllAdmins();
            setAdmins(admins);
        } catch (err) {
            let errorMessage = "Ошибка при получении данных";
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        }
    }

    const updateChatOnlineStatus = (chatId: string, isOnline: boolean) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat._id === chatId ? {...chat, isClientOnline: isOnline} : chat
            )
        );
    };

    return {
        allChats,
        totalPages,
        messages,
        admins,
        fetchChatError,
        addChat,
        setChats,
        setMessages,
        fetchData,
        fetchOneChat,
        fetchAdmins,
        updateChatOnlineStatus,
    }
}

export default useAdminChatFetcher;