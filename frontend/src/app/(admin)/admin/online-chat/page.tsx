'use client'

import React, {useEffect, useState} from 'react';
import useAdminChatFetcher from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatFetcher";
import {Button} from "@/src/components/ui/button";
import {useAdminChatWS} from "./hooks/useAdminChatWS"

const Page = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");

    const {
        allChats,
        messages,
        fetchData,
        setMessages,
        fetchOneChat
    } = useAdminChatFetcher();

    useEffect(() => {
        void fetchData();
    }, []);


    useEffect(() => {
        if(selectedChatId) void fetchOneChat(selectedChatId);
    }, [selectedChatId]);

    const { sendMessage } = useAdminChatWS({
        selectedChatId,
        onMessage: (msg) => {
            setMessages((prev) => [...prev, msg]);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage(input.trim());

        setMessages((prev) => [
            ...prev,
            {
                sender: "admin",
                senderName: "Вы",
                text: input.trim(),
                timestamp: new Date(),
            },
        ]);
        setInput("");
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 border-r overflow-y-auto">
                {allChats.map((chat) => (
                    <div
                        key={chat._id}
                        className={`p-4 cursor-pointer hover:bg-gray-100 ${
                            selectedChatId === chat._id ? "bg-gray-200" : ""
                        }`}
                        onClick={() => setSelectedChatId(chat._id)}
                    >
                        <div className="font-semibold">{chat.clientName}</div>
                        <div className="text-sm text-gray-500 truncate">{chat.createdAt}</div>
                    </div>
                ))}
            </div>

            <div className="w-2/3 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                    msg.sender === "admin" ? "ml-auto bg-blue-100" : "bg-gray-100"
                                }`}
                            >
                                <div className="text-sm text-gray-600">{msg.senderName}</div>
                                <div>{msg.text}</div>
                                <div className="text-xs text-gray-400 text-right">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">Нет сообщений</p>
                    )}
                </div>

                <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Введите сообщение"
                            className="flex-1 border rounded px-4 py-2"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Отправить
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;