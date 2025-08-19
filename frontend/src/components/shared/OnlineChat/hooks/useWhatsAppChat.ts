import { useState } from "react";
import {sendWhatsAppMessage} from "@/actions/superadmin/whatsApp";
import {ChatMessage} from "@/src/lib/types";
import {toast} from "react-toastify";

const useWhatsAppChat =() => {
    const [whatsAppMessages, setWhatsAppMessages] = useState<ChatMessage[]>([]);

    const sendWAppMessage = async (text: string, name: string,phone: string) => {
        const newMessage: ChatMessage = {
            text,
            timestamp: new Date(),
            sender: "client",
            senderName: name,
        };

        setWhatsAppMessages((prev) => [...prev, newMessage]);

        try {
            await sendWhatsAppMessage(phone, text);
        } catch {
            toast.error("Ошибка отправки:");
        }
    };

    return {
        whatsAppMessages,
        setWhatsAppMessages,
        sendWAppMessage,
    };
}


export default useWhatsAppChat;