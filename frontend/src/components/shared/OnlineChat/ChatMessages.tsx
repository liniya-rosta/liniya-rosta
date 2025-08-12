import React from 'react';
import {ChatMessage} from "@/src/lib/types";

interface Props {
    message: ChatMessage;
}

const ChatMessages: React.FC<Props> = ({message}) => {
    return (
        <div
            className={`my-1 ${message.sender === "client" ? "text-right" : "text-left"}`}
        >
            <div className="inline-block px-2 py-1 bg-gray-100 rounded">
                <span>{message.text}</span>
            </div>
        </div>
    );
};

export default ChatMessages;