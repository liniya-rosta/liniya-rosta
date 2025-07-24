import express from "express";
import {Error, Types} from "mongoose";
import Service from "../../models/Service";
import {ServiceUpdate} from "../../../types";
import {translateYandex} from "../../../translateYandex";

const servicesSuperAdminRouter = express.Router();

servicesSuperAdminRouter.post("/", async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title?.ru) {
            res.status(400).send({ error: "Поле title.ru обязательно" })
            return;
        }

        const translatedTitle = await translateYandex(title.ru, "ky");
        const translatedDescription = description?.ru
            ? await translateYandex(description.ru, "ky")
            : null;

        const service = new Service({
            title: {
                ru: title.ru,
                ky: translatedTitle,
            },
            description: {
                ru: description?.ru || null,
                ky: translatedDescription,
            },
        });
        await service.save();
        res.send(service);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

servicesSuperAdminRouter.patch("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const { title, description } = req.body;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID услуг"});
            return;
        }

        const updateData: ServiceUpdate = {};

        if (title !== undefined) {
            const translatedTitle: string = await translateYandex(title.ru, "ky");
            updateData.title = {
                ru: title.ru,
                ky: translatedTitle
            };
        }

        if (description !== undefined) {
            const translatedDescription: string = await translateYandex(description.ru, "ky");
            updateData.description = {
                ru: description.ru,
                ky: translatedDescription
            }
        }

        const updatedService = await Service.findByIdAndUpdate(
            id,
            updateData,
            {new: true, runValidators: true}
        );

        if (!updatedService) {
            res.status(404).send({message: "Элемент не найден"});
            return;
        }

        res.send(updatedService);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

servicesSuperAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID услуг"});
            return;
        }

        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            res.status(404).send({message: "Элемент не найден"});
            return;
        }

        res.send({message: "Удаление услуги успешно"});
    } catch (error) {
        next(error);
    }
});

export default servicesSuperAdminRouter;