"use client";

import { useState } from "react";
import { useClientChat } from "./useOnlineChat";
import { Button } from "@/src/components/ui/button";
import {Headset} from "lucide-react";

const OnlineChat = () => {
    const [name, setName] = useState("");
    const [hasEnteredName, setHasEnteredName] = useState(false);
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { connect, sendMessage, messages, connected } = useClientChat();


    const handleOpenChat = () => {
        setIsOpen(true);
    };

    const handleEnterName = () => {
        if (!connected && name.trim()) {
            connect(name);
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
                <Button
                    variant="secondary"
                    onClick={handleOpenChat} className="bg-highlight-light px-8 py-4">
                    <Headset className="text-3xl text-highlight"/>
                </Button>
            ) : (
                <div className="w-80 h-96 border bg-white rounded shadow flex flex-col p-2">
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`my-1 ${msg.sender === "client" ? "text-right" : "text-left"}`}
                            >
                                <div className="inline-block px-2 py-1 bg-gray-100 rounded">
                                    <b className="block">{msg.senderName}</b>
                                   <span>{msg.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!hasEnteredName ? (
                        <div className="mt-2 flex gap-2">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Введите имя"
                                className="border p-1 rounded w-full"
                            />
                            <Button onClick={handleEnterName} disabled={!name.trim()}>
                                Войти
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