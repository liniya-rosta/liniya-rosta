import { useEffect, useRef } from "react";
import useUserStore from "@/store/usersStore";
import { WS_URL } from "@/src/lib/globalConstants";
import { toast } from "react-toastify";
import {useAdminChatStore} from "@/store/superadmin/adminChatStore";

interface Props {
    updateChatOnlineStatus: (chatId: string, isOnline: boolean) => void;
}

export const useAdminChatWS = ({ updateChatOnlineStatus }: Props) => {
    const wsRef = useRef<WebSocket | null>(null);
    const { accessToken } = useUserStore();
    const {setOneChatMessages} = useAdminChatStore();

    useEffect(() => {
        const wsUrl = `${WS_URL}?token=${accessToken}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => console.log("WebSocket: админ подключен");
        ws.onclose = () => console.log("WebSocket: админ отключен");

        ws.onmessage = (event) => {
            try {

                const data = JSON.parse(event.data);

                if (data.type === "new_message") {
                    console.log(data);
                    setOneChatMessages((prev) => {
                        if (!prev || prev._id !== data.chatId) return prev;
                        return {
                            ...prev,
                            messages: [...prev.messages, data],
                        };
                    });
                }

                if (data.type === "client_offline") {
                    updateChatOnlineStatus?.(data.chatId, false);
                }
            } catch {
                toast.error("Ошибка получения сообщения");
            }
        };

        return () => {
            ws.close();
        };
    }, [accessToken]);

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