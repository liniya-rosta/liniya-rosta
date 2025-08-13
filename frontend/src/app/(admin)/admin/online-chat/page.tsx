"use client";

import React, { useEffect, useState } from "react";
import useAdminChatFetcher from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatFetcher";
import { useAdminChatWS } from "./hooks/useAdminChatWS";
import ChatList from "@/src/app/(admin)/admin/online-chat/components/ChatList";

import ChatFiltersPanel from "@/src/app/(admin)/admin/online-chat/components/ChatFiltersPanel";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import useAdminChatActions from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatActions";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import ChatMessages from "@/src/app/(admin)/admin/online-chat/components/ChatMessages";

const Page = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState("");

    const {
        fetchChatError,
        setOneChatMessages,
        setFetchChatLoading,
    } = useAdminChatStore();

    const {
        user,
        admins,
        filters,
        limit,
        setLimit,
        setChats,
        fetchData,
        fetchOneChat,
        fetchAdmins,
        setFilters,
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
        void fetchData();
    }, [filters, limit]);

    useEffect(() => {
        if (admins.length === 0) {
            void fetchAdmins();
        }
    }, [admins]);

    useEffect(() => {
        if (!selectedChatId) {
            const interval = setInterval(() => {
                void fetchData();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [filters, limit]);


    useEffect(() => {
        if (selectedChatId) {
            void fetchOneChat(selectedChatId);
        }
    }, [selectedChatId]);


    const { sendMessage } = useAdminChatWS({updateChatOnlineStatus});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        if(selectedChatId) {
            sendMessage(selectedChatId, inputMessage.trim());
            setOneChatMessages(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    messages: [
                        ...prev.messages,
                        {
                            sender: "admin",
                            senderName: user?.displayName || "Вы",
                            text: inputMessage.trim(),
                            timestamp: new Date(),
                        }
                    ]
                };
            });
        }

        setInputMessage("");
    };

    if (fetchChatError) return <ErrorMsg error={fetchChatError}/>;

    return (
        <div>
            <h1 className="text-23-30-1_5 mb-5 font-bold text-center md:text-left">
                Список чатов
            </h1>

            <ChatFiltersPanel
                onChange={setFilters}
                adminList={admins}
            />
            <div className="flex h-[calc(100vh-100px)] md:h-screen">
                <ChatList
                    selectedChatId={selectedChatId}
                    onSelect={setSelectedChatId}
                    onRequestDelete={() => setShowConfirm(true)}
                    onStatusUpdated={handleStatusChange}
                    onLoadMore={() => {
                        setLimit((prev) => prev + 10);
                        setFetchChatLoading(true);
                    }}
                    className={`${selectedChatId ? "hidden" : "flex"} flex-col w-full md:block md:w-1/3 border-r overflow-y-auto`}
                />
                <ChatMessages
                    input={inputMessage}
                    onInputChange={setInputMessage}
                    onSubmit={handleSubmit}
                    onBack={() => {
                        setSelectedChatId(null);
                        setOneChatMessages(null);
                    }}
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