import {Request, Response, NextFunction} from "express";
import Service from "../models/Service";
import {Types} from "mongoose";

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const total = await Service.countDocuments();
        const services = await Service.find();

        res.send({
            items: services,
            total,
        });
    } catch (error) {
        next(error);
    }
};

export const getServiceByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID услуг"});
            return
        }

        const service = await Service.findById(id);

        if (!service) {
            res.status(404).send({error: "Услуга не найдена"});
            return
        }

        res.send(service);
    } catch (error) {
        next(error);
    }
}