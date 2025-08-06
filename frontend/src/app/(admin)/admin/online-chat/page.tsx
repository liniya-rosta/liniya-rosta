"use client";

import React, { useEffect, useState } from "react";
import useAdminChatFetcher from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatFetcher";
import { useAdminChatWS } from "./hooks/useAdminChatWS";
import ChatList from "@/src/app/(admin)/admin/online-chat/components/ChatList";
import ChatMessages from "@/src/app/(admin)/admin/online-chat/components/ChatMessages";

const Page = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");

    const {
        allChats,
        messages,
        addChat,
        fetchData,
        setMessages,
        fetchOneChat,
    } = useAdminChatFetcher();

    useEffect(() => {
        void fetchData();
    }, []);

    useEffect(() => {
        if (selectedChatId) void fetchOneChat(selectedChatId);
    }, [selectedChatId]);

    const { sendMessage } = useAdminChatWS({
        selectedChatId,
        onMessage: (msg) => {
            setMessages((prev) => [...prev, msg]);
        },
        onNewChat: (chat) => addChat(chat),
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
            <ChatList
                chats={allChats}
                selectedChatId={selectedChatId}
                onSelect={setSelectedChatId}
            />
            <ChatMessages
                messages={messages}
                input={input}
                onInputChange={setInput}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Page;