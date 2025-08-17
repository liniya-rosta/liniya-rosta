import {ChatMessage} from "@/src/lib/types";
import { useRef, useState } from "react";
import {WS_URL} from "@/src/lib/globalConstants";
import {useTranslations} from "next-intl";
import {toast} from "react-toastify";

export const useClientChat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);
    const tFormChat = useTranslations("FormChat");

    const connect = (clientName: string, phone: string) => {
        if (ws.current) return;

        ws.current = new WebSocket(WS_URL);
        ws.current.onopen = () => {
            console.log("WS клиент в сети");
            setConnected(true);

            ws.current?.send(JSON.stringify({
                type: "client_message",
                name: clientName,
                text: tFormChat("automaticMsg") + phone,
            }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "error") {
                toast.error(data.message);
            }

            if (data.type === "session_created") {
                setChatId(data.chatId);
            }

            if (data.type === "new_message") {
                setChatMessages((prev) => [...prev, data]);
            }

            if (data.type === "user_reset") {
                setChatMessages(prev => [...prev, {
                    sender: "client",
                    senderName: "",
                    text: "Вы сбросили данные. Введите имя и телефон снова.",
                    timestamp: new Date(),
                }]);
            }
        };

        ws.current.onclose = () => {
            console.log("WS клиент вышел из сети");
            ws.current = null;
            setConnected(false);
        };
    };

    const sendMessage = (text: string, clientName: string) => {
        if (!chatId || !ws.current) return;

        ws.current.send(JSON.stringify({
            type: "client_message",
            chatId,
            name: clientName,
            text,
        }));
    };

    return { connect, sendMessage, chatMessages, chatId, connected, setChatMessages };
};
