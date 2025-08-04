import express from "express";
import expressWs from "express-ws";
import {WebSocket} from "ws";
import ChatSession from "../models/ChatSession";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../models/User";
import {AdminMessage, ChatMessage, ClientMessage} from "../../types";

const connectedClients: Record<string, WebSocket[]> = {};
const adminSockets: WebSocket[] = [];

export const getOnlineChatRouter = (
    wsInstance: ReturnType<typeof expressWs>
) => {
    const router = express.Router();
    wsInstance.applyTo(router);

    router.ws("/online-chat", (ws: WebSocket, req) => {
        let isAdmin = false;
        let chatId: string | null = null;
        let nickname: string | null = null;

        ws.on("message", async (msg) => {
            try {
                const data = JSON.parse(msg.toString()) as AdminMessage | ClientMessage;

                if (data.type === "client_message") {
                    if (!data.chatId) {
                        const session = await ChatSession.create({
                            clientName: data.name,
                            messages: [],
                        });

                        chatId = session._id.toString();
                        connectedClients[chatId] = connectedClients[chatId] || [];
                        connectedClients[chatId].push(ws);

                        ws.send(JSON.stringify({type: "session_created", chatId}));
                    } else {
                        chatId = data.chatId;
                        connectedClients[chatId] = connectedClients[chatId] || [];
                        if (!connectedClients[chatId].includes(ws)) {
                            connectedClients[chatId].push(ws);
                        }

                    }

                    const message: ChatMessage = {
                        sender: "client",
                        senderName: data.name,
                        text: data.text,
                        timestamp: new Date(),
                    };

                    await ChatSession.findByIdAndUpdate(chatId, {
                        $push: {messages: message},
                        $set: {updatedAt: new Date()},
                    });

                    for (const admin of adminSockets) {
                        admin.send(JSON.stringify({type: "new_message", chatId, ...message}));
                    }
                }

                if (data.type === "admin_message" && isAdmin && data.chatId) {
                    const message: ChatMessage = {
                        sender: "admin",
                        senderName: nickname || "Админ",
                        text: data.text,
                        timestamp: new Date(),
                    };

                    const chat = await ChatSession.findById(data.chatId);

                    if (chat && !chat.adminId) {
                        chat.adminId = (jwt.verify(req.headers.authorization!.split(" ")[1], JWT_SECRET) as any)._id;
                    }

                    await ChatSession.findByIdAndUpdate(data.chatId, {
                        $push: {messages: message},
                        $set: {updatedAt: new Date(), admin: chat?.adminId},
                    });

                    if (connectedClients[data.chatId]) {
                        connectedClients[data.chatId].forEach((clientWs) => {
                            clientWs.send(JSON.stringify({type: "new_message", chatId: data.chatId, ...message}));
                        });
                    }
                }
            } catch (e) {
                console.error("WS error", e);
            }
        });

        ws.on("close", () => {
            if (chatId && connectedClients[chatId]) {
                connectedClients[chatId] = connectedClients[chatId].filter((sock) => sock !== ws);
            }

            if (isAdmin) {
                const index = adminSockets.indexOf(ws);
                if (index !== -1) adminSockets.splice(index, 1);
            }
        });
    });

    return router;
};