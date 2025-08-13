import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import {fetchAllChats, fetchChatById} from "@/actions/superadmin/onlineChat";
import React, {useState} from "react";
import {ChatFilters} from "@/src/lib/types";
import {toast} from "react-toastify";
import {getAllAdmins} from "@/actions/superadmin/admins";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import useUserStore from "@/store/usersStore";

const useAdminChatFetcher = () => {
    const {
        setChats,
        setOneChatMessages,
        setFetchChatLoading,
        setFetchChatError,
        setPaginationChat,
    } = useAdminChatStore();

    const {user} = useUserStore();

    const {admins, setAdmins} = useSuperadminAdminsStore();
    const [filters, setFilters] = React.useState<ChatFilters>({});
    const [limit, setLimit] = useState(20);

    const fetchData = async () => {
        setFetchChatError(null);

        try {
            const data = await fetchAllChats({ ...filters, limit });
            setChats(data.items);

            setPaginationChat({
                total: data.total,
                page: data.page,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
            });
        } catch (err) {
            let errorMessage = "Ошибка при получении списка чата";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setFetchChatError(errorMessage);
        } finally {
            setFetchChatLoading(false);
        }
    };

    const fetchOneChat = async (chatId: string) => {
        try {
            const data = await fetchChatById(chatId);
            setOneChatMessages({_id: chatId, messages: data.messages});
        } catch (err) {
            let errorMessage = "Ошибка при получении данных одного чата";
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
            let errorMessage = "Ошибка при получении списка админов";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        }
    }

    return {
        user,
        filters,
        limit,
        admins,
        setChats,
        setLimit,
        setFilters,
        setOneChatMessages,
        fetchData,
        fetchOneChat,
        fetchAdmins,
    }
}

export default useAdminChatFetcher;