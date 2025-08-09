import React from "react";
import { ChatSession } from "@/src/lib/types";
import dayjs from "dayjs";
import {deleteChat, updateChatStatus} from "@/actions/superadmin/onlineChat";
import { toast } from "react-toastify";
import { Button} from "@/src/components/ui/button";

import {chat_statuses} from "@/src/app/(admin)/admin/online-chat/constants";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/src/components/ui/select";

interface ChatListProps {
    chats: ChatSession[];
    selectedChatId: string | null;
    onSelect: (chatId: string) => void;
    onChatDeleted: (id: string) => void;
    onStatusUpdated: (id: string, status: string) => void;
    onLoadMore: () => void;
    canLoadMore: boolean;
}

const ChatList: React.FC<ChatListProps> = (
    {chats, selectedChatId, onSelect, onChatDeleted, onStatusUpdated, onLoadMore, canLoadMore=false}) => {

    const handleDelete = async (chatId: string) => {
        try {
            await deleteChat(chatId);
            toast.success("Чат удален");
            onChatDeleted(chatId);
        } catch {
            toast.error("Ошибка при удалении чата");
        }
    };

    const handleStatusChange = async (chatId: string, status: string) => {
        try {
            await updateChatStatus(chatId, status);
            toast.success("Статус обновлен");
            onStatusUpdated(chatId, status);
        } catch {
            toast.error("Ошибка при изменении статуса");
        }
    };


    return (
        <div className="w-1/3 border-r flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            className={`p-4 border-b hover:bg-gray-50 ${
                                selectedChatId === chat._id ? "bg-gray-100" : ""
                            }`}
                        >
                            <div
                                className="cursor-pointer"
                                onClick={() => onSelect(chat._id)}
                            >
                                <div className="font-medium flex items-center gap-2">
                                    {chat.clientName}
                                    {chat.isClientOnline && (
                                        <span className="text-green-500 text-xs">● онлайн</span>
                                    )}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {dayjs(chat.createdAt).format("DD.MM.YYYY HH:mm")}
                                </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <Select
                                    onValueChange={(value) =>
                                        handleStatusChange(chat._id, value)
                                    }
                                    defaultValue={chat.status || chat_statuses[0]}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Выбрать статус" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chat_statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(chat._id)}
                                >
                                    Удалить
                                </Button>

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">Список чатов пуст</p>
                )}
            </div>
            {chats.length > 0 && (
                <div className="p-4 text-center">
                    <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={canLoadMore}
                    >
                        Загрузить ещё 20
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ChatList;