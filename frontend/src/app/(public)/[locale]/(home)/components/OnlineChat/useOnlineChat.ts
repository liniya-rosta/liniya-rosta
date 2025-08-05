import {ChatMessage} from "@/src/lib/types";
import { useRef, useState } from "react";

export const useClientChat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);

    const connect = (clientName: string) => {
        if (ws.current) return;

        ws.current = new WebSocket("ws://localhost:8000/ws/online-chat");
        ws.current.onopen = () => {
            console.log("WS connection opened");
            setConnected(true);

            ws.current?.send(JSON.stringify({
                type: "client_message",
                name: clientName,
                text: "Здравствуйте! Я хочу проконсультироваться.",
            }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "session_created") {
                setChatId(data.chatId);
            }

            if (data.type === "new_message") {
                setMessages((prev) => [...prev, data]);
            }
        };

        ws.current.onclose = () => {
            console.log("WS connection closed");
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

    return { connect, sendMessage, messages, chatId, connected };
};
