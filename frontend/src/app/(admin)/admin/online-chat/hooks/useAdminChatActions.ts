import { deleteChat, updateChatStatus } from "@/actions/superadmin/onlineChat";
import { toast } from "react-toastify";
import {ChatSession} from "@/src/lib/types";
import React from "react";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";

const useAdminChatActions = (
    setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>,
    fetchData: () => Promise<void>
) => {
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

            setChats((prev) => {
                const updated = prev.filter((chat) => !selectedToDelete.includes(chat._id));
                if (updated.length === 0) {
                    fetchData();
                }
                return updated;
            });
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

    return {
        selectedToDelete,
        deleteChatLoading,
        showConfirm,
        setSelectedToDelete,
        setShowConfirm,
        handleDelete,
        handleStatusChange,
    };
};

export default useAdminChatActions;