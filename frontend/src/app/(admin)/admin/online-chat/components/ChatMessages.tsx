import React from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import ChatBubble from "@/src/components/ui/ChatBubble";
import { motion } from "motion/react";
import useUserStore from "@/store/usersStore";

interface ChatMessagesProps {
    input: string;
    onInputChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
                                                              input,
                                                              onInputChange,
                                                              onSubmit,
                                                              onBack
                                                          }) => {

    const {oneChatMessages} =useAdminChatStore();
    const {user} = useUserStore();

    const disabledBtn = oneChatMessages?.messages.length === 0 || oneChatMessages?.status === "Без ответа" ||
        oneChatMessages?.status === "Завершена" || (oneChatMessages?.adminId !== user?._id && oneChatMessages?.status !== "Новый");

    return (
        <motion.div

            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full lg:flex lg:w-2/3 h-full"
        >
            <div className="flex items-center p-4 border-b">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="mr-2"
                    disabled={!oneChatMessages}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-medium">Чат</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {oneChatMessages && oneChatMessages.messages.length > 0 ? (
                    oneChatMessages.messages.map((msg, index) => (
                        <ChatBubble
                            key={index}
                            message={msg}
                            align={msg.sender === "admin" ? "right" : "left"}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-400">Нет сообщений</p>
                )}
            </div>

            <div className="sticky bottom-0 bg-white border-t px-4 py-6 shrink-0">
                <form onSubmit={onSubmit} className="flex gap-3 justify-between items-center">
                    <input
                        type="text"
                        placeholder="Введите сообщение"
                        className="flex-1 border rounded px-4 py-2"
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                    />
                    <Button type="submit" className="px-4 py-2" disabled={disabledBtn}>
                        Отправить
                    </Button>
                </form>
            </div>
        </motion.div>
    );
};

export default ChatMessages;