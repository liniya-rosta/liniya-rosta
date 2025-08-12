import {ChatMessage} from "@/src/lib/types";
import { useRef, useState } from "react";

export const useClientChat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);

    const connect = (clientName: string, phone: string) => {
        if (ws.current) return;

        ws.current = new WebSocket("ws://localhost:8000/ws/online-chat");
        ws.current.onopen = () => {
            console.log("WS клиент в сети");
            setConnected(true);

            ws.current?.send(JSON.stringify({
                type: "client_message",
                name: clientName,
                text: `Здравствуйте! Я хочу проконсультироваться. Мой телефон: ${phone}`,
            }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "session_created") {
                setChatId(data.chatId);
            }

            if (data.type === "new_message") {
                setChatMessages((prev) => [...prev, data]);
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
