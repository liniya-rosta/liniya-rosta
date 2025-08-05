import useUserStore from '@/store/usersStore';
import React from 'react';
import {Button} from "@/src/components/ui/button";

const Chat = () => {
    const { accessToken } = useUserStore();

    const {
        connect,
        sendMessage,
        chatMessages,
        setActiveChatId,
        activeChatId,
        messages,
    } = useAdminWebSocket(accessToken);

    const [text, setText] = useState("");

    useEffect(() => {
        connect();
    }, []);

    const handleSend = () => {
        if (activeChatId && text.trim()) {
            sendMessage(activeChatId, text);
            setText("");
        }
    };

    return (
        <div className="flex">
            <div className="w-1/4 border-r p-2">
                {Object.keys(chatMessages).map((chatId) => (
                    <Button
                        key={chatId}
                        onClick={() => setActiveChatId(chatId)}
                        className={`block w-full text-left p-2 ${chatId === activeChatId ? "bg-blue-100" : ""}`}
                    >
                        Чат {chatId.slice(-4)}
                    </Button>
                ))}
            </div>
            <div className="flex-1 p-2 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-1">
                    {messages.map((msg, i) => (
                        <div key={i} className={msg.sender === "admin" ? "text-right" : "text-left"}>
                            <div className="inline-block px-2 py-1 bg-gray-200 rounded">
                                <strong>{msg.senderName}</strong>: {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                {activeChatId && (
                    <div className="flex gap-2 mt-2">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="border p-1 w-full rounded"
                            placeholder="Сообщение..."
                        />
                        <button onClick={handleSend} className="bg-green-500 text-white px-3 rounded">
                            ➤
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;