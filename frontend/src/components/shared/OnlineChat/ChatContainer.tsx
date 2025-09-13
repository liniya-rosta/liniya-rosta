"use client";

import React, {useEffect, useRef, useState} from "react";
import {useClientChat} from "./hooks/useOnlineChat";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import ChatBubble from "@/src/components/ui/ChatBubble";
import {Headset, X} from "lucide-react";
import {useTranslations} from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    ChatUserForm,
    ChatMessageForm,
    createChatUserSchema,
    createChatMessageSchema,
} from "@/src/lib/zodSchemas/chat";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {AnimatePresence, motion} from "framer-motion";

const ChatContainer = () => {
    const tFormChat = useTranslations("FormChat");
    const tFormError = useTranslations("FormErrors");

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [userEntered, setUserEntered] = useState(false);

    const {connect, sendMessage, chatMessages, connected} = useClientChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const userForm = useForm<ChatUserForm>({
        resolver: zodResolver(createChatUserSchema(tFormError)),
        defaultValues: {name: "", phone: ""},
    });

    const messageForm = useForm<ChatMessageForm>({
        resolver: zodResolver(createChatMessageSchema(tFormError)),
        defaultValues: {text: ""},
    });

    const currentUser = userForm.watch();

    const onEnterChat = (data: ChatUserForm) => {
        if (!connected) connect(data.name, data.phone);
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const onSendMessage = async ({text}: ChatMessageForm) => {
        sendMessage(text, currentUser.name);
        messageForm.reset();
    };

    return (
        <div className={`fixed ${isChatOpen ? "bottom-0" : " bottom-40"} md:bottom-40 right-0 2xl:right-50 z-50`}>
            <div
                className={`flex flex-col ${
                    isChatOpen
                        ? "w-screen h-[80vh] max-w-full max-h-full md:w-[400px] md:h-[560px]"
                        : ""
                }`}
            >
                {isChatOpen && (
                    <div className="flex flex-col border bg-white rounded-xl shadow py-4 px-2 h-full lg:h-[560px]">

                        <div className="flex justify-end items-center mb-2 border-b pb-3">
                            <Button variant="outline" onClick={() => setIsChatOpen(false)}>
                                <X/>
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                            {chatMessages.length === 0 ? (
                                <p className="text-center text-gray-400 mt-4">
                                    {tFormChat("contactAdminMessage")}
                                </p>
                            ) : (
                                chatMessages.map((message, i) => (
                                    <ChatBubble
                                        key={i}
                                        message={message}
                                        align={message.sender === "client" ? "right" : "left"}
                                    />
                                ))
                            )}
                            <div ref={messagesEndRef}/>
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

                {!isChatOpen && (
                    <AnimatePresence>
                        <motion.button
                            key="main-button"
                            onClick={() => setIsChatOpen(true)}
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.5}}
                            transition={{duration: 0.2}}
                            className="bg-highlight-light w-12 h-12 md:w-15 md:h-15 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                        >
                            <Headset className="text-white h-7 w-7 md:w-8 md:h-8 relative z-10"/>
                        </motion.button>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ChatContainer;