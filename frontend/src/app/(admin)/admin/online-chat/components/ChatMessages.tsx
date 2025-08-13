import React from "react";
import { Button } from "@/src/components/ui/button";
import {cn} from "@/src/lib/utils";
import { ArrowLeft } from "lucide-react";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import ChatBubble from "@/src/components/ui/ChatBubble";

interface ChatMessagesProps {
    input: string;
    onInputChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    className?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
                                                              input,
                                                              onInputChange,
                                                              onSubmit,
                                                              className,
                                                              onBack
                                                          }) => {

    const {oneChatMessages} =useAdminChatStore();

    return (
        <div className={cn(className)}>
            <div className="flex items-center p-4 border-b">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="mr-2"
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

            <div className="sticky bottom-0 bg-white border-t p-4 shrink-0">
                <form onSubmit={onSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Введите сообщение"
                        className="flex-1 border rounded px-4 py-2"
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                    />
                    <Button type="submit" className="px-4 py-2" disabled={ oneChatMessages?.messages.length === 0}>
                        Отправить
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatMessages;