import express from "express";
import ChatSession from "../../models/ChatSession";
import mongoose from "mongoose";

const chatAdminRouter = express.Router();

chatAdminRouter.get("/", async (_req, res, next) => {
    try {
        const allChats = await ChatSession.find();
        res.send(allChats);
    } catch (error) {
        next(error);
    }
});

chatAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const chatId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            res.status(400).send({error: "Неверный формат ID чата"});
            return;
        }

        const chat = await ChatSession.findByIdAndDelete({ _id: chatId });

        if(!chat) {
            res.status(404).send({error: "Чат не найден"});
            return;
        }
        res.send({message: "Чат успешно удален"});
    } catch (error) {
        next(error);
    }
});

export default chatAdminRouter;