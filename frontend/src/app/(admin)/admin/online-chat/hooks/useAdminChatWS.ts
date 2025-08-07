import { useEffect, useRef } from "react";
import useUserStore from "@/store/usersStore";
import {ChatMessage, ChatSession,} from "@/src/lib/types";

interface Props {
    selectedChatId: string | null;
    onMessage: (msg: ChatMessage) => void;
    onNewChat: (chat: ChatSession) => void;
    updateChatOnlineStatus: (chatId: string, isOnline: boolean) => void;
}

export const useAdminChatWS = ({ selectedChatId, onMessage, onNewChat, updateChatOnlineStatus }: Props) => {
    const wsRef = useRef<WebSocket | null>(null);
    const { accessToken } = useUserStore();

    useEffect(() => {
        const wsUrl = `ws://localhost:8000/ws/online-chat?token=${accessToken}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => console.log("WebSocket: админ подключен");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "new_message" && data.chatId === selectedChatId) {
                    onMessage({
                        sender: data.sender,
                        senderName: data.senderName,
                        text: data.text,
                        timestamp: new Date(data.timestamp),
                    });
                }

                if (data.type === "new_chat") {
                    onNewChat(data.chat);
                }

                if (data.type === "client_offline") {
                    if (typeof updateChatOnlineStatus === "function") {
                        updateChatOnlineStatus(data.chatId, false);
                    }
                }
            } catch (err) {
                console.error("WS parse error", err);
            }
        };

        ws.onclose = () => console.log("WebSocket: админ отключен");
        return () => ws.close();
    }, [selectedChatId, accessToken]);

    const sendMessage = (text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !selectedChatId) return;
        wsRef.current.send(JSON.stringify({
            type: "admin_message",
            chatId: selectedChatId,
            text,
        }));
    };

    return { sendMessage };
};