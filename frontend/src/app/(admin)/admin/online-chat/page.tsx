"use client";

import React, {useEffect, useState} from "react";
import useAdminChatFetcher from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatFetcher";
import {useAdminChatWS} from "./hooks/useAdminChatWS";
import ChatList from "@/src/app/(admin)/admin/online-chat/components/ChatList";

import ChatFiltersPanel from "@/src/app/(admin)/admin/online-chat/components/ChatFiltersPanel";
import ErrorMsg from "@/src/components/ui/ErrorMsg";
import useAdminChatActions from "@/src/app/(admin)/admin/online-chat/hooks/useAdminChatActions";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";
import ChatMessages from "@/src/app/(admin)/admin/online-chat/components/ChatMessages";
import useUserStore from "@/store/usersStore";
import {useSuperadminAdminsStore} from "@/store/superadmin/superadminAdminsStore";
import { hasBadWords } from "@/src/lib/profanityFilter";
import {toast} from "react-toastify";

const Page = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState("");

    const {
        fetchChatError,
        setOneChatMessages,
        setFetchChatLoading,
        paginationChat,
    } = useAdminChatStore();

    const {user} = useUserStore();
    const {admins} = useSuperadminAdminsStore();

    const {
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
    } = useAdminChatActions(setChats, fetchData);

    useEffect(() => {
        void fetchData();
    }, [fetchData, selectedChatId]);

    useEffect(() => {
        if (admins.length === 0) {
            void fetchAdmins();
        }
    }, [admins, fetchAdmins]);

    useEffect(() => {
        const interval = setInterval(() => {
            void fetchData();
        }, 5000);
        return () => clearInterval(interval);

    }, [filters, limit, fetchData]);

    useEffect(() => {
        if (selectedChatId) {
            void fetchOneChat(selectedChatId);
        }
    }, [selectedChatId, fetchOneChat]);


    const {sendMessage} = useAdminChatWS();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        if (hasBadWords(inputMessage)) {
            toast.error("Сообщение содержит недопустимые слова!");
            return;
        }

        if (selectedChatId) {
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

    const isLoadMoreDisabled = paginationChat && limit > paginationChat.total || deleteChatLoading;
    if (fetchChatError) return <ErrorMsg error={fetchChatError}/>;

    return (
        <div className="mb-9">
            <h1 className="text-23-30-1_5 mb-5 font-bold text-center md:text-left">
                Список чатов
            </h1>

            <ChatFiltersPanel
                onChange={setFilters}
                adminList={admins}
            />
            <div className="flex h-[calc(100vh-100px)] lg:h-screen">
                <ChatList
                    key="chat-list"
                    selectedChatId={selectedChatId}
                    onSelect={setSelectedChatId}
                    onRequestDelete={() => setShowConfirm(true)}
                    onStatusUpdated={handleStatusChange}
                    onLoadMore={() => {
                        setLimit((prev) => prev + 10);
                        setFetchChatLoading(true);
                    }}
                    isLoadMoreDisabled={isLoadMoreDisabled}
                    className={`w-full flex-col overflow-y-auto lg:w-1/3 border-r, ${selectedChatId ? "hidden lg:flex" : "flex"}`
                    }
                />

                {selectedChatId && (
                    <ChatMessages
                        key="chat-messages"
                        input={inputMessage}
                        onInputChange={setInputMessage}
                        onSubmit={handleSubmit}
                        onBack={() => {
                            setSelectedChatId(null);
                            setOneChatMessages(null);
                        }}
                    />
                )}
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