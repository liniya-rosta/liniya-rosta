import {useCallback, useEffect, useRef} from "react";
import useUserStore from "@/store/usersStore";
import { WS_URL } from "@/src/lib/globalConstants";
import { toast } from "react-toastify";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";

export const useAdminChatWS = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const { accessToken } = useUserStore();
    const {setOneChatMessages} = useAdminChatStore();

    const handleNewMessage = useCallback((data: any) => {
        if (data.type === "new_message") {
            setOneChatMessages((prev) => {
                if (!prev || prev._id !== data.chatId) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, data],
                };
            });
        }
    }, [setOneChatMessages]);

    useEffect(() => {
        const wsUrl = `${WS_URL}?token=${accessToken}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => console.log("WebSocket: админ подключен");
        ws.onclose = () => console.log("WebSocket: админ отключен");

        ws.onmessage = (event) => {
            try {

                const data = JSON.parse(event.data);
                handleNewMessage(data);
            } catch {
                toast.error("Ошибка получения сообщения");
            }
        };

        return () => {
            ws.close();
        };
    }, [accessToken, handleNewMessage]);

    const sendMessage = (chatId: string, text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(JSON.stringify({
            type: "admin_message",
            chatId,
            text,
        }));
    };

    return { sendMessage };
};