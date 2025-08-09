import { deleteChat, updateChatStatus } from "@/actions/superadmin/onlineChat";
import { toast } from "react-toastify";
import {ChatSession} from "@/src/lib/types";
import React from "react";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";

const useAdminChatActions = (setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>) => {
    const {
        selectedToDelete,
        setSelectedToDelete,
        deleteChatLoading,
        setDeleteChatLoading,
    } = useAdminChatStore();

    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleDelete = async () => {
        try {
            setShowConfirm(false);
            setDeleteChatLoading(true);

            await Promise.all(selectedToDelete.map((id) => deleteChat(id)));

            toast.success(
                selectedToDelete.length > 1
                    ? `Удалено чатов: ${selectedToDelete.length}`
                    : "Чат удален"
            );

            setChats((prev) => prev.filter((chat) => !selectedToDelete.includes(chat._id)));
        } catch {
            toast.error("Ошибка при удалении чата");
        } finally {
            setDeleteChatLoading(false);
            setSelectedToDelete([]);
        }
    };

    const handleStatusChange = async (chatId: string, status: string) => {
        try {
            await updateChatStatus(chatId, status);
            toast.success("Статус обновлен");
            setChats((prev) =>
                prev.map((chat) => (chat._id === chatId ? { ...chat, status } : chat))
            );
        } catch {
            toast.error("Ошибка при изменении статуса");
        }
    };

    const updateChatOnlineStatus = (chatId: string, isOnline: boolean) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat._id === chatId ? {...chat, isClientOnline: isOnline} : chat
            )
        );
    };

    return {
        selectedToDelete,
        deleteChatLoading,
        showConfirm,
        setSelectedToDelete,
        setShowConfirm,
        handleDelete,
        handleStatusChange,
        updateChatOnlineStatus
    };
};

export default useAdminChatActions;