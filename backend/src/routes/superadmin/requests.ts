import express from "express";
import RequestFromClient from "../../models/Request";
import {UpdatesRequest} from "../../../types";
import {Types} from "mongoose";

const requestAdminRouter = express.Router();

requestAdminRouter.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;
        const dateFrom = req.query.dateFrom as string | undefined;
        const dateTo = req.query.dateTo as string | undefined;
        const limit = 20;
        const skip = (page - 1) * limit;
        const archived = req.query.archived as string | undefined;

        type FilterValue =
            | string
            | boolean
            | { $regex: string; $options: string }
            | { $gte?: Date; $lte?: Date };

        const filter: Record<string, FilterValue> = {};

        if (status) {
            filter.status = status;
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        filter.isArchived = archived === 'true';

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom + "T00:00:00Z");
            if (dateTo) filter.createdAt.$lte = new Date(dateTo + "T23:59:59Z");
        }

        const [requests, total] = await Promise.all([
            RequestFromClient.find(filter)
                .skip(skip)
                .limit(limit)
                .exec(),
            RequestFromClient.countDocuments(filter),
        ]);

        res.send({
            data: requests,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении заявок" });
    }
});

requestAdminRouter.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID заявки"});
            return;
        }

        const request = await RequestFromClient.findById(id);
        if (!request) {
            res.status(404).send("Заявка не найдена");
            return;
        }
        res.send(request);
    } catch (e) {
        next(e)
    }
});

requestAdminRouter.patch('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, phone, email, status, commentOfManager, isArchived} = req.body;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID заявки"});
            return;
        }

        if (name !== undefined && !name.trim()) {
             res.status(400).send({ error: "Имя должно быть заполнено" });
            return
        }

        if (email !== undefined && !email.trim()) {
             res.status(400).send({ error: "Почта должна быть заполнена" });
            return
        }

        if (phone !== undefined && !phone.trim()) {
             res.status(400).send({ error: "Номер телефона должен быть заполнен" });
             return
        }

        const updates: UpdatesRequest = {};
        if (name !== undefined) updates.name = name.trim();
        if (phone !== undefined) updates.phone = phone.trim();
        if (email !== undefined) updates.email = email.trim();
        if (status !== undefined) updates.status = status;
        if (commentOfManager !== undefined) updates.commentOfManager = commentOfManager;
        if (isArchived !== undefined) updates.isArchived = isArchived;

        const updated = await RequestFromClient.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true}
        );

        if (!updated) {
            res.status(404).send("Заявка не найдена");
            return;
        }

        res.send({message: "Заявка обновлена", request: updated});
    } catch (e) {
        next(e)
    }
});

requestAdminRouter.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID заявки"});
            return;
        }

        const request = await RequestFromClient.findOneAndDelete({_id: id});

        if (!request) {
            res.status(404).send("Заявка не найдена");
            return
        }

        res.send({message: "Заявка удалена"});
    } catch (e) {
        next(e)
    }
});

export default requestAdminRouter;