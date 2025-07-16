import express from "express";
import {Error, Types} from "mongoose";
import Service from "../../models/Service";
import {ServiceUpdate} from "../../../types";

const servicesSuperAdminRouter = express.Router();

servicesSuperAdminRouter.post("/", async (req, res, next) => {
    try {
        const newService = new Service({
            title: req.body.title,
            description: req.body.description,
        });

        await newService.save();
        res.send(newService);
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

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID услуг"});
            return;
        }

        const updateData: ServiceUpdate = {};

        if (req.body.title !== undefined) {
            updateData.title = req.body.title;
        }

        if (req.body.description !== undefined) {
            updateData.description = req.body.description;
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