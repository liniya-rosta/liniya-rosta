"use client";

import React, { useEffect, useState } from "react";
import useAdminChatFetcher from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatFetcher";
import { useAdminChatWS } from "./hooks/useAdminChatWS";
import ChatList from "@/src/app/(admin)/admin/online-chat/components/ChatList";
import ChatMessages from "@/src/app/(admin)/admin/online-chat/components/ChatMessages";
import {ChatFilters} from "@/src/lib/types";
import ChatFiltersPanel from "@/src/app/(admin)/admin/online-chat/components/ChatFiltersPanel";

const Page = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [filters, setFilters] = React.useState<ChatFilters>({});

    const {
        allChats,
        messages,
        admins,
        addChat,
        setChats,
        fetchData,
        setMessages,
        fetchOneChat,
        fetchAdmins,
        updateChatOnlineStatus
    } = useAdminChatFetcher();

    useEffect(() => {
        void fetchData(filters);
    }, [filters]);

    useEffect(() => {
        if (admins.length === 0) {
            void fetchAdmins();
        }
    }, [admins]);

    useEffect(() => {
        if (selectedChatId) void fetchOneChat(selectedChatId);
    }, [selectedChatId]);

    const { sendMessage } = useAdminChatWS({
        selectedChatId,
        onMessage: (msg) => {
            setMessages((prev) => [...prev, msg]);
        },
        onNewChat: (chat) => addChat(chat),
        updateChatOnlineStatus,
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
        <div>
            <ChatFiltersPanel onChange={setFilters} adminList={admins}/>
            <div className="flex h-screen">
                <ChatList
                    chats={allChats}
                    selectedChatId={selectedChatId}
                    onSelect={setSelectedChatId}
                    onChatDeleted={(id) => setChats((prev) => prev.filter(chat => chat._id !== id))}
                    onStatusUpdated={(id, status) =>
                        setChats((prev) => prev.map(chat => chat._id === id ? { ...chat, status } : chat))
                    }
                />
                <ChatMessages
                    messages={messages}
                    input={input}
                    onInputChange={setInput}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default Page;