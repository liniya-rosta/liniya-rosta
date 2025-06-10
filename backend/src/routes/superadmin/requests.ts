import express from "express";
import RequestFromClient from "../../models/Request";
import {UpdatesRequest} from "../../../types";
import {Types} from "mongoose";

const requestAdminRouter = express.Router();

requestAdminRouter.get('/', async (req, res, next) => {
    try {
        const requests = await RequestFromClient.find();
        if (requests.length === 0) {
            res.status(404).send("Заявки не найдены");
            return;
        }
        res.send(requests);
    } catch (e) {
        next(e)
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
        const {name, phone, email, status, commentOfManager} = req.body;

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