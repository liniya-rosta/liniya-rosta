"use client";

import React, { useEffect, useState } from "react";
import useAdminChatFetcher from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatFetcher";
import { useAdminChatWS } from "./hooks/useAdminChatWS";
import ChatList from "@/src/app/(admin)/admin/online-chat/components/ChatList";
import ChatMessages from "@/src/app/(admin)/admin/online-chat/components/ChatMessages";
import {ChatFilters} from "@/src/lib/types";
import ChatFiltersPanel from "@/src/app/(admin)/admin/online-chat/components/ChatFiltersPanel";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import useAdminChatActions from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatActions";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";

const Page = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [filters, setFilters] = React.useState<ChatFilters>({});
    const [page, setPage] = useState(1);



    const {
        user,
        allChats,
        messages,
        admins,
        fetchChatError,
        totalPages,
        addChat,
        setChats,
        fetchData,
        setMessages,
        fetchOneChat,
        fetchAdmins,
    } = useAdminChatFetcher();

    const {
        deleteChatLoading,
        selectedToDelete,
        showConfirm,
        setShowConfirm,
        handleDelete,
        handleStatusChange,
        updateChatOnlineStatus,
    } = useAdminChatActions(setChats);

    useEffect(() => {
        void fetchData(filters, page);
    }, [filters, page]);

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
                senderName: user?.displayName || "Вы",
                text: input.trim(),
                timestamp: new Date(),
            },
        ]);
        setInput("");
    };

    if (fetchChatError) return <ErrorMsg error={fetchChatError}/>;

    return (
        <div>
            <h1 className="text-23-30-1_5 mb-5 font-bold text-center md:text-left">
                Список чатов
            </h1>

            <ChatFiltersPanel onChange={setFilters} adminList={admins}/>
            <div className="flex h-[calc(100vh-100px)] md:h-screen">
                <ChatList
                    chats={allChats}
                    selectedChatId={selectedChatId}
                    onSelect={setSelectedChatId}
                    onRequestDelete={() => setShowConfirm(true)}
                    onStatusUpdated={handleStatusChange}
                    onLoadMore={() => setPage((prev) => prev + 1)}
                    canLoadMore={page >= totalPages}
                    className={`${selectedChatId ? "hidden" : "flex"} flex-col w-full md:block md:w-1/3 border-r overflow-y-auto`}
                />
                <ChatMessages
                    messages={messages}
                    input={input}
                    onInputChange={setInput}
                    onSubmit={handleSubmit}
                    onBack={() => setSelectedChatId(null)}
                    className={`${selectedChatId ? "flex" : "hidden"} flex-col w-full md:flex md:w-2/3 h-full`}
                />
            </div>


            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={
                    selectedToDelete.length > 1
                        ? "Удалить выбранные чаты?"
                        : "Удалить чат?"
                }
                onConfirm={handleDelete}
                loading={deleteChatLoading}
                text="Вы уверены? Это действие невозможно отменить"
            />
        </div>
    );
};

export default Page;