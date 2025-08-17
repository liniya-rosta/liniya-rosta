import express from "express";
import expressWs from "express-ws";
import {WebSocket} from "ws";
import ChatSession from "../models/ChatSession";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../models/User";
import { ChatMessage, IncomingMessage} from "../../types";
import {cleanText, hasBadWords} from "../../profanityFilter";

const connectedClients: Record<string, WebSocket[]> = {};
const adminSockets: WebSocket[] = [];
export const onlineClients = new Set<string>();
const messageHistory = new WeakMap<WebSocket, number[]>();

const hasRepeatingChars = (text: string, limit = 5): boolean => {
    const regex = new RegExp(`(.)\\1{${limit},}`, "i");
    return regex.test(text);
};

export const getOnlineChatRouter = (
    wsInstance: ReturnType<typeof expressWs>
) => {
    const router = express.Router();
    wsInstance.applyTo(router);

    router.ws("/online-chat", (ws: WebSocket, req) => {
        let isAdmin = false;
        let chatId: string | null = null;
        let nickname: string | null = null;

        const token = new URL(req.url!, "http://localhost").searchParams.get("token");
        let admin: { _id: string; displayName: string } | null = null;

        if (token) {
            try {
                admin = jwt.verify(token, JWT_SECRET) as { _id: string; displayName: string };
                isAdmin = true;
                nickname = admin.displayName;
                adminSockets.push(ws);

                ws.send(JSON.stringify({
                    type: "online_list",
                    chatIds: Array.from(onlineClients),
                }));
            } catch (e) {
                console.log("Недействительный токен администратора");
            }
        }

        ws.on("message", async (msg) => {
            try {
                const data = JSON.parse(msg.toString()) as IncomingMessage;

                if (data.text) {
                    if (data.text.length > 500) {
                        ws.send(JSON.stringify({ type: "error", message: "Сообщение слишком длинное (макс 500 символов)" }));
                        return;
                    }

                    const now = Date.now();
                    const timestamps = messageHistory.get(ws) || [];
                    const recent = timestamps.filter((t) => now - t < 5000);
                    if (recent.length >= 5) {
                        ws.send(JSON.stringify({ type: "error", message: "Слишком часто отправляете сообщения" }));
                        return;
                    }

                    recent.push(now);
                    messageHistory.set(ws, recent);
                }

                if (data.type === "client_message") {
                    if (hasBadWords(data.name) || hasRepeatingChars(data.name)) {
                        ws.send(JSON.stringify({ type: "error", message: "Имя недопустимо" }));
                        return;
                    }

                    if (!data.chatId) {
                        const session = await ChatSession.create({
                            clientName: data.name,
                            messages: [],
                        });

                        chatId = session._id.toString();
                        connectedClients[chatId] = connectedClients[chatId] || [];
                        connectedClients[chatId].push(ws);
                        onlineClients.add(chatId);

                        ws.send(JSON.stringify({type: "session_created", chatId}));

                        for (const adminWs of adminSockets) {
                            adminWs.send(JSON.stringify({
                                type: "new_chat",
                                chat: {
                                    _id: session._id,
                                    clientName: session.clientName,
                                    createdAt: session.createdAt,
                                    updatedAt: session.updatedAt,
                                    messages: [],
                                    isClientOnline: true,
                                }
                            }));
                        }

                    } else {
                        chatId = data.chatId;
                        connectedClients[chatId] = connectedClients[chatId] || [];
                        if (!connectedClients[chatId].includes(ws)) {
                            connectedClients[chatId].push(ws);
                        }
                        onlineClients.add(chatId);
                    }

                    if (hasBadWords(data.text) || hasRepeatingChars(data.text)) {
                        ws.send(JSON.stringify({ type: "error", message: "Сообщение недопустимо" }));
                        return;
                    }

                    const filteredText = cleanText(data.text);

                    const message: ChatMessage = {
                        sender: "client",
                        senderName: data.name,
                        text: filteredText,
                        timestamp: new Date(),
                    };

                    await ChatSession.findByIdAndUpdate(chatId, {
                        $push: {messages: message},
                        $set: {updatedAt: new Date()},
                    });

                    for (const admin of adminSockets) {
                        admin.send(JSON.stringify({type: "new_message", chatId: data.chatId, ...message}));
                    }

                    if (connectedClients[chatId]) {
                        for (const client of connectedClients[chatId]) {
                            client.send(JSON.stringify({ type: "new_message", chatId, ...message }));
                        }
                    }
                }

                if (data.type === "admin_message" && isAdmin && admin) {
                    const filteredText = cleanText(data.text);

                    const message: ChatMessage = {
                        sender: "admin",
                        senderName: nickname || "Админ",
                        text: filteredText,
                        timestamp: new Date(),
                    };

                    await ChatSession.findByIdAndUpdate(data.chatId, {
                        $push: { messages: message },
                        $set: {
                            updatedAt: new Date(),
                            status: "В работе",
                            adminId: admin._id,
                        },
                    });

                    if (connectedClients[data.chatId]) {
                        connectedClients[data.chatId].forEach((clientWs) => {
                            clientWs.send(JSON.stringify({ type: "new_message", chatId: data.chatId, ...message }));
                        });
                    }
                }

            } catch (e) {
                console.error("Ошибка WS", e);
            }
        });

        ws.on("close", async () => {
            if (chatId && connectedClients[chatId]) {
                connectedClients[chatId] = connectedClients[chatId].filter((sock) => sock !== ws);
                onlineClients.delete(chatId);

                const chat = await ChatSession.findById(chatId).select("status");
                if (chat && chat.status !== "В работе") {
                    await ChatSession.findByIdAndUpdate(chatId, {
                        $set: { status: "Без ответа" }
                    });
                }

                for (const adminWs of adminSockets) {
                    adminWs.send(JSON.stringify({
                        type: "client_offline",
                        chatId,
                    }));
                }
            }

            if (isAdmin) {
                const index = adminSockets.indexOf(ws);
                if (index !== -1) adminSockets.splice(index, 1);
            }
        });
    });

    return router;
};