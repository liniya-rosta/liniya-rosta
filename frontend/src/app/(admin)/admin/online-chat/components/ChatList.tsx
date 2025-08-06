import React from "react";
import { ChatSession } from "@/src/lib/types";

interface ChatListProps {
    chats: ChatSession[];
    selectedChatId: string | null;
    onSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({chats, selectedChatId, onSelect}) => {
    return (
        <div className="w-1/3 border-r flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            className={`p-4 cursor-pointer hover:bg-gray-100 ${
                                selectedChatId === chat._id ? "bg-gray-200" : ""
                            }`}
                            onClick={() => onSelect(chat._id)}
                        >
                            <div className="font-semibold">{chat.clientName}</div>
                            <div className="text-sm text-gray-500 truncate">
                                {chat.createdAt}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">Список чатов пуст</p>
                )}
            </div>
        </div>
    );
};

export default ChatList;