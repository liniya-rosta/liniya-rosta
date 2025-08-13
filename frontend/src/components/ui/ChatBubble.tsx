import React from "react";
import dayjs from "dayjs";
import { cn } from "@/src/lib/utils";
import { ChatMessage } from "@/src/lib/types";

interface ChatBubbleProps {
    message: ChatMessage;
    align?: "left" | "right";
    showSenderName?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
                                                   message,
                                                   align = message.sender === "admin" ? "right" : "left",
                                                   showSenderName = true,
                                               }) => {
    const isRight = align === "right";

    return (
        <div className={cn("my-1", isRight ? "text-right" : "text-left")}>
            <div
                className={cn(
                    "inline-block rounded max-w-[70%] py-2 px-3 mb-2 break-words whitespace-pre-wrap",
                    isRight ? "bg-blue-100" : "bg-gray-100"
                )}
            >
                {showSenderName && (
                    <div className="text-sm text-gray-600 mb-1">{message.senderName}</div>
                )}
                <div className="mb-1">{message.text}</div>
                <div
                    className={cn(
                        "text-xs text-gray-400",
                        isRight ? "text-right" : "text-left"
                    )}
                >
                    {dayjs(message.timestamp).format("HH:mm")}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
