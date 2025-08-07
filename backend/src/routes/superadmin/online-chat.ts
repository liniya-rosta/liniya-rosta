import express from "express";
import ChatSession from "../../models/ChatSession";
import mongoose from "mongoose";

const chatAdminRouter = express.Router();

chatAdminRouter.get("/", async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const status = req.query.status as string | undefined;
        const clientName = req.query.clientName as string | undefined;
        const createdFrom = req.query.createdFrom as string | undefined;
        const createdTo = req.query.createdTo as string | undefined;
        const updatedFrom = req.query.updatedFrom as string | undefined;
        const updatedTo = req.query.updatedTo as string | undefined;
        const adminId = req.query.adminId as string | undefined;

        type FilterValue =
            | string
            | { $regex: string; $options: string }
            | { $gte?: Date; $lte?: Date };

        const filter: Record<string, FilterValue> = {};

        if (status) filter.status = status;
        if (clientName) filter.clientName = { $regex: clientName, $options: "i" };
        if (adminId) filter.adminId = adminId;

        if (createdFrom || createdTo) {
            filter.createdAt = {};
            if (createdFrom) filter.createdAt.$gte = new Date(createdFrom + "T00:00:00Z");
            if (createdTo) filter.createdAt.$lte = new Date(createdTo + "T23:59:59Z");
        }

        if (updatedFrom || updatedTo) {
            filter.updatedAt = {};
            if (updatedFrom) filter.updatedAt.$gte = new Date(updatedFrom + "T00:00:00Z");
            if (updatedTo) filter.updatedAt.$lte = new Date(updatedTo + "T23:59:59Z");
        }

        const [chats, totalCount] = await Promise.all([
            ChatSession.find(filter)
                .select("-messages")
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit),
            ChatSession.countDocuments(filter),
        ]);

        res.send({
            items: chats,
            total: totalCount,
            page,
            pageSize: limit,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        next(error);
    }
});

chatAdminRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID чата"});
            return;
        }

        const chat = await ChatSession.findById(id);

        if(!chat) {
            res.status(404).send({error: "Чат не найден"});
            return;
        }

        res.send(chat);
    } catch (error) {
        next(error);
    }
});

chatAdminRouter.patch("/:id", async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID чата"});
            return;
        }

        const updatedChat = await ChatSession.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedChat) {
             res.status(404).json({ error: "Чат не найден" });
            return;
        }

        res.send(updatedChat);
    } catch (error) {
        next(error);
    }
});

chatAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID чата"});
            return;
        }

        const chat = await ChatSession.findByIdAndDelete({ _id: id });

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