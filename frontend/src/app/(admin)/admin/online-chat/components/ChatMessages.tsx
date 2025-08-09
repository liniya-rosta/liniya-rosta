import React from "react";
import { ChatMessage } from "@/src/lib/types";
import { Button } from "@/src/components/ui/button";
import dayjs from "dayjs";
import {cn} from "@/src/lib/utils";
import { ArrowLeft } from "lucide-react";

interface ChatMessagesProps {
    messages: ChatMessage[];
    input: string;
    onInputChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    className?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
                                                              messages,
                                                              input,
                                                              onInputChange,
                                                              onSubmit,
                                                              className,
                                                              onBack
                                                          }) => {
    return (
        <div className={cn(className)}>
            <div className="flex items-center p-4 border-b md:hidden">
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
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[70%] w-auto px-4 py-2 rounded-lg ${
                                msg.sender === "admin"
                                    ? "ml-auto bg-blue-100"
                                    : "bg-gray-100"
                            }`}
                        >
                            <div className="text-sm text-gray-600">{msg.senderName}</div>
                            <div>{msg.text}</div>
                            <div className="text-xs text-gray-400 text-right">
                                {dayjs(msg.timestamp).format('HH:mm')}
                            </div>
                        </div>
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
                    <Button type="submit" className="px-4 py-2" disabled={messages.length === 0}>
                        Отправить
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatMessages;