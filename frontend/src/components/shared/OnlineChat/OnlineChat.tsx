"use client";

import { useState } from "react";
import { useClientChat } from "./useOnlineChat";
import { Button } from "@/src/components/ui/button";
import { Headset } from "lucide-react";
import { motion } from "motion/react";

const OnlineChat = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [hasEnteredName, setHasEnteredName] = useState(false);
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { connect, sendMessage, messages, connected } = useClientChat();

    const handleOpenChat = () => {
        setIsOpen(true);
    };

    const handleEnterName = () => {
        if (!connected && name.trim() && phone.trim()) {
            connect(name, phone);
        }
        setHasEnteredName(true);
    };

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message, name);
            setMessage("");
        }
    };

    return (
        <div className="fixed bottom-24 right-24 z-50">
            {!isOpen ? (
                <motion.button
                    onClick={handleOpenChat}
                    className="bg-highlight-light rounded-full shadow-lg relative flex items-center justify-center"
                    style={{ width: 70, height: 70 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        className="absolute inset-0 rounded-full bg-highlight-light opacity-50"
                        animate={{
                            scale: [1, 1.8],
                            opacity: [0.6, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                    <motion.span
                        className="absolute inset-0 rounded-full bg-highlight-light opacity-50"
                        animate={{
                            scale: [1, 1.8],
                            opacity: [0.6, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 1,
                        }}
                    />
                    <Headset className="text-white w-10 h-10 relative z-10" />
                </motion.button>
            ) : (
                <div className="w-80 h-96 border bg-white rounded shadow flex flex-col p-2">
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                        {messages.length === 0 ? (
                            <p className="text-center text-gray-400 mt-4">Чат пуст</p>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`my-1 ${
                                        msg.sender === "client" ? "text-right" : "text-left"
                                    }`}
                                >
                                    <div className="inline-block px-2 py-1 bg-gray-100 rounded">
                                        <b className="block">{msg.senderName}</b>
                                        <span>{msg.text}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {!hasEnteredName ? (
                        <div className="mt-2 flex flex-col gap-2">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Введите имя"
                                className="border p-1 rounded w-full"
                            />
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Введите телефон"
                                className="border p-1 rounded w-full"
                            />
                            <Button
                                onClick={handleEnterName}
                                disabled={!name.trim() || !phone.trim()}
                            >
                                Открыть чат
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-2 flex gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Введите сообщение..."
                                className="border p-1 rounded w-full"
                            />
                            <Button onClick={handleSend}>➤</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OnlineChat;