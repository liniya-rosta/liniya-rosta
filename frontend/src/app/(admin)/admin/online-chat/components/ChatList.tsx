import React from "react";
import dayjs from "dayjs";
import { Button} from "@/src/components/ui/button";
import {chat_statuses} from "@/src/app/(admin)/admin/online-chat/constants";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/src/components/ui/select";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import { Checkbox } from "@/src/components/ui/checkbox";
import {LoaderIcon} from "lucide-react";
import { motion } from "motion/react";

interface ChatListProps {
    selectedChatId: string | null;
    onSelect: (chatId: string) => void;
    onRequestDelete: () => void;
    onStatusUpdated: (id: string, status: string) => void;
    onLoadMore: () => void;
    className?: string;
    isLoadMoreDisabled: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
                                               selectedChatId,
                                               onSelect,
                                               onRequestDelete,
                                               onStatusUpdated,
                                               onLoadMore,
                                               className,
                                               isLoadMoreDisabled
}) => {
    const {
        allChats,
        selectedToDelete,
        fetchChatLoading,
        setSelectedToDelete,
        deleteChatLoading,
    } = useAdminChatStore();
    const allSelected = allChats.length > 0 && allChats.every((c) => selectedToDelete.includes(c._id));

    const toggleAll = () => {
        if (allSelected) {
            setSelectedToDelete([]);
        } else {
            setSelectedToDelete(allChats.map((c) => c._id));
        }
    };

    const toggleOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedToDelete([...selectedToDelete, id].filter((v, i, a) => a.indexOf(v) === i));
        } else {
            setSelectedToDelete(selectedToDelete.filter((s) => s !== id));
        }
    };

    const isDeleteBtnDisabled = deleteChatLoading || selectedToDelete.length === 0;

    return (
        <motion.div
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -50}}
            transition={{duration: 0.3}}
            className={className}
        >
            <div className="p-4 border-b-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleAll}
                        aria-label="Выбрать все чаты на странице"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <h2 className="font-medium">Чаты</h2>
                </div>
                    <Button
                        onClick={onRequestDelete}
                        variant="destructive"
                        disabled={isDeleteBtnDisabled}
                    >Удалить ({selectedToDelete.length})</Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {allChats.length > 0 ? (
                    allChats.map((chat) => {
                        const isChecked = selectedToDelete.includes(chat._id);
                        return (
                            <div
                                key={chat._id}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedChatId === chat._id ? "bg-gray-100" : ""}`}
                                onClick={() => onSelect(chat._id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={(val) => {
                                                const checked = Boolean(val);
                                                toggleOne(chat._id, checked)
                                            }}
                                            aria-label={`Выбрать чат ${chat.clientName}`}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-medium flex items-center gap-2">
                                            {chat.clientName}
                                            {chat.isClientOnline && <span className="text-green-500 text-xs">● онлайн</span>}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {dayjs(chat.createdAt).format("DD.MM.YYYY HH:mm")}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-3 items-center justify-between">
                                    <Select
                                        value={chat.status || chat_statuses[0]}
                                        onValueChange={(value) => onStatusUpdated(chat._id, value)}
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
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-destructive"
                                        onClick={() => {
                                            onRequestDelete();
                                            setSelectedToDelete([chat._id]);
                                        }}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-400 mt-3">Список чатов пуст</p>
                )}
            </div>

            {allChats.length > 0 && (
                <div className="p-4 text-center">
                    <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={isLoadMoreDisabled}
                    >
                        {fetchChatLoading && <LoaderIcon/>}
                        Загрузить ещё
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default ChatList;