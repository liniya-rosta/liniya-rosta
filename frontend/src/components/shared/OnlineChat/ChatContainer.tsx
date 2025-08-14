"use client";

import React, {useState} from "react";
import {useClientChat} from "./hooks/useOnlineChat";
import {Button} from "@/src/components/ui/button";
import {motion, AnimatePresence} from "framer-motion";
import {Input} from "../../ui/input";
import ChatIconsButtons from "@/src/components/shared/OnlineChat/ChatIconsButtons";
import useWhatsAppChat from "@/src/components/shared/OnlineChat/hooks/useWhatsAppChat";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import {RotateCcw, X} from "lucide-react";
import {useTranslations} from "next-intl";
import ChatBubble from "@/src/components/ui/ChatBubble";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

export type ChatType = "online" | "whatsapp";

interface ChatUserData {
    name: string;
    phone: string;
    entered: boolean;
}

const ChatContainer = () => {
    const tConfirm = useTranslations("Confirms");
    const tFormChat = useTranslations("FormChat");

    const [chatType, setChatType] = useState<ChatType>("online");
    const [chatData, setChatData] = useState<Record<ChatType, ChatUserData>>({
        online: {name: "", phone: "", entered: false},
        whatsapp: {name: "", phone: "", entered: false}
    });

    const [message, setMessage] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);

    const { connect, sendMessage, chatMessages, connected } = useClientChat();
    const { whatsAppMessages, sendWAppMessage } = useWhatsAppChat();

    const currentData = chatData[chatType];

    const updateCurrentData = (field: keyof ChatUserData, value: string | boolean) => {
        setChatData(prev => ({
            ...prev,
            [chatType]: {...prev[chatType], [field]: value}
        }));
    };

    const handleMainButtonClick = () => setIsMenuOpen(prev => !prev);

    const handleSelectChat = (type: ChatType) => {
        setChatType(type);
        setIsChatOpen(true);
        setIsMenuOpen(false);
    };

    const handleEnterName = () => {
        if (!currentData.name.trim() || !currentData.phone.trim()) return;

        if (chatType === "online" && !connected) {
            connect(currentData.name, currentData.phone);
        }

        updateCurrentData("entered", true);
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        if (chatType === "online") {
            sendMessage(message, currentData.name);
        } else {
            await sendWAppMessage(message, currentData.name, currentData.phone);
        }
        setMessage("");
    };

    const handleReset = () => {
        setChatData(prev => ({
            ...prev,
            [chatType]: {name: "", phone: "", entered: false}
        }));
        setMessage("");
    };

    return (
        <div className="fixed bottom-24 right-24 z-50 flex flex-col items-center gap-3">
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        key="chat-container"
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.8}}
                        transition={{duration: 0.3}}
                        className="w-100 border bg-white rounded-xl shadow py-4 px-2"
                    >
                        <div className="flex justify-between items-center mb-2 border-b pb-3">

                            <Button variant="outline" onClick={() => setIsShowConfirm(true)}>
                                <RotateCcw/> Сброс
                            </Button>
                            {chatType === "whatsapp" && <span>WhatsApp</span>}
                            <Button variant="outline" onClick={() => setIsChatOpen(false)}> <X/></Button>
                        </div>

                        <div className="flex flex-col h-96">
                            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                                {(chatType === "online" ? chatMessages : whatsAppMessages).length === 0
                                    ?
                                    <p className="text-center text-gray-400 mt-4">{tFormChat("contactAdminMessage")}</p>
                                    : (chatType === "online" ? chatMessages : whatsAppMessages).map((message, i) => (
                                        <ChatBubble
                                            key={i}
                                            message={message}
                                            align={message.sender === "client" ? "right" : "left"}/>
                                    ))
                                }
                            </div>

                            {!currentData.entered ? (
                                <div className="mt-2 flex flex-col gap-2">
                                    <Input
                                        value={currentData.name}
                                        onChange={(e) => updateCurrentData("name", e.target.value)}
                                        placeholder={tFormChat("namePlaceholder")}
                                        className="border p-1 rounded w-full"
                                    />
                                    <PhoneInput
                                        value={currentData.phone}
                                        country="kg"
                                        onChange={(value) => updateCurrentData("phone", value)}
                                        placeholder={tFormChat("phonePlaceholder")}
                                        containerClass="w-full"
                                        inputClass="!w-full border p-1 rounded"
                                        buttonClass="!border !border-gray-300"
                                    />
                                    <Button
                                        onClick={handleEnterName}
                                        disabled={!currentData.phone.trim() || !currentData.name.trim()}
                                    >
                                        {tFormChat("openChat")}
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-2 flex gap-2">
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="border p-1 rounded w-full"
                                    />
                                    <Button onClick={handleSend}>➤</Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                <ChatIconsButtons
                    isChatOpen={isChatOpen}
                    isMenuOpen={isMenuOpen}
                    onSelectChat={handleSelectChat}
                    onMainButtonClick={handleMainButtonClick}
                />
            </AnimatePresence>

            <ConfirmDialog
                open={isShowConfirm}
                onOpenChange={setIsShowConfirm}
                title={tConfirm("chatResetTitle")}
                onConfirm={handleReset}
                text={tConfirm("chatResetDescription")}
                confirmText={tConfirm("confirmBtn")}
                cancelText={tConfirm("cancelBtn")}
            />
        </div>
    );
};

export default ChatContainer;