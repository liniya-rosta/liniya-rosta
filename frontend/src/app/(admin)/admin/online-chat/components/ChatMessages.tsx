import React from "react";
import { ChatMessage } from "@/src/lib/types";
import { Button } from "@/src/components/ui/button";
import dayjs from "dayjs";

interface ChatMessagesProps {
    messages: ChatMessage[];
    input: string;
    onInputChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
                                                              messages,
                                                              input,
                                                              onInputChange,
                                                              onSubmit,
                                                          }) => {
    return (
        <div className="w-2/3 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
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

            <div className="border-t p-4 shrink-0">
                <form onSubmit={onSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Введите сообщение"
                        className="flex-1 border rounded px-4 py-2"
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                    />
                    <Button type="submit" className="px-4 py-2">
                        Отправить
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatMessages;