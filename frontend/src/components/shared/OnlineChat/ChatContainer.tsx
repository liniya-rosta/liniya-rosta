"use client";

import React, {useEffect, useRef, useState} from "react";
import {useClientChat} from "./hooks/useOnlineChat";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import ChatIconsButtons from "@/src/components/shared/OnlineChat/ChatIconsButtons";
import ChatBubble from "@/src/components/ui/ChatBubble";
import {X} from "lucide-react";
import {useTranslations} from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    ChatUserForm,
    ChatMessageForm,
    createChatUserSchema,
    createChatMessageSchema
} from "@/src/lib/zodSchemas/chat";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import useWhatsAppChat from "@/src/components/shared/OnlineChat/hooks/useWhatsAppChat";

export type ChatType = "online" | "whatsapp";

const ChatContainer = () => {
    const tFormChat = useTranslations("FormChat");
    const tFormError = useTranslations("FormErrors");

    const [chatType, setChatType] = useState<ChatType>("online");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [userEntered, setUserEntered] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const {connect, sendMessage, chatMessages, connected} = useClientChat();
    const {whatsAppMessages, sendWAppMessage} = useWhatsAppChat();

    const userForm = useForm<ChatUserForm>({
        resolver: zodResolver(createChatUserSchema(tFormError)),
        defaultValues: {name: "", phone: ""},
    });

    const messageForm = useForm<ChatMessageForm>({
        resolver: zodResolver(createChatMessageSchema(tFormError)),
        defaultValues: {text: ""},
    });

    const currentUser = userForm.watch();
    const messages = chatType === "online" ? chatMessages : whatsAppMessages;

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onEnterChat = (data: ChatUserForm) => {
        if (chatType === "online" && !connected) connect(data.name, data.phone);
    };

    const onSendMessage = async ({text}: ChatMessageForm) => {
        if (chatType === "online") {
            sendMessage(text, currentUser.name);
        } else {
            await sendWAppMessage(text, currentUser.name, currentUser.phone);
        }
        messageForm.reset();
        scrollToBottom();
    };

    const handleMainButtonClick = () => setIsMenuOpen(prev => !prev);

    const handleSelectChat = (type: ChatType) => {
        setChatType(type);
        setIsChatOpen(true);
        setIsMenuOpen(false);
    };

    return (
        <div className={`fixed bottom-24 right-0 z-50`}>
            <div className="mx-auto max-w-[1400px] flex justify-end px-4">
                <div
                    className={`flex flex-col ${isChatOpen
                        ? "w-[80vh] h-[80vh] lg:h-[560px] lg:w-[400px]"
                        : ""}`}
                >

                    {isChatOpen && (
                        <div className="flex flex-col border bg-white rounded-xl shadow py-4 px-2 h-full lg:h-[560px]">

                            <div className="flex justify-between items-center mb-2 border-b pb-3">
                                {chatType === "whatsapp" && <span>WhatsApp</span>}
                                <Button variant="outline" onClick={() => setIsChatOpen(false)}>
                                    <X/>
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                                {messages.length === 0 ? (
                                    <p className="text-center text-gray-400 mt-4">
                                        {tFormChat("contactAdminMessage")}
                                    </p>
                                ) : (
                                    messages.map((message, i) => (
                                        <ChatBubble
                                            key={i}
                                            message={message}
                                            align={message.sender === "client" ? "right" : "left"}
                                        />
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {!userEntered ? (
                                <form onSubmit={userForm.handleSubmit((data) => {
                                    onEnterChat(data);
                                    setUserEntered(true);
                                })}>
                                    <Input
                                        {...userForm.register("name")}
                                        placeholder={tFormChat("namePlaceholder")}
                                        className="border p-1 rounded w-full mb-2"
                                    />
                                    {userForm.formState.errors.name && (
                                        <FormErrorMessage className="mb-3">
                                            {userForm.formState.errors.name.message}
                                        </FormErrorMessage>
                                    )}

                                    <Controller
                                        name="phone"
                                        control={userForm.control}
                                        render={({field}) => (
                                            <PhoneInput
                                                country="kg"
                                                value={field.value}
                                                onChange={(val) => field.onChange(val)}
                                                onBlur={field.onBlur}
                                                inputProps={{name: field.name, required: true}}
                                                containerClass="w-full"
                                                inputClass="!w-full border p-1 rounded"
                                                buttonClass="!border !border-gray-300"
                                            />
                                        )}
                                    />
                                    {userForm.formState.errors.phone && (
                                        <FormErrorMessage className="mb-3">
                                            {userForm.formState.errors.phone.message}
                                        </FormErrorMessage>
                                    )}

                                    <Button
                                        className="mt-4"
                                        type="submit">{tFormChat("openChat")}</Button>
                                </form>
                            ) : (
                                <>
                                    {messageForm.formState.errors.text && (
                                        <FormErrorMessage className="mt-1">
                                            {messageForm.formState.errors.text.message}
                                        </FormErrorMessage>
                                    )}

                                    <form onSubmit={messageForm.handleSubmit(onSendMessage)}
                                          className="mt-2 flex items-center gap-2 border-t-2 py-4 lg:pt-4">
                                        <div className="flex-1 flex flex-col">
                                            <Input
                                                {...messageForm.register("text")}
                                                placeholder={tFormChat("messagePlaceholder")}
                                                className={"border p-1 rounded w-full"}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        messageForm.handleSubmit(onSendMessage)();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <Button type="submit">➤</Button>
                                    </form>
                                </>
                            )}
                        </div>
                    )}

                    <ChatIconsButtons
                        isChatOpen={isChatOpen}
                        isMenuOpen={isMenuOpen}
                        onSelectChat={handleSelectChat}
                        onMainButtonClick={handleMainButtonClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
