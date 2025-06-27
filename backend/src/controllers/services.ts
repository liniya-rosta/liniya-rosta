import {Request, Response, NextFunction} from "express";
import Service from "../models/Service";

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.query as { title?: string };
        const filter: { title?: { $regex: string; $options: string } } = {};

        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }

        const total = await Service.countDocuments();
        const services = await Service.find(filter);

        res.send({
            items: services,
            total,
        });
    } catch (error) {
        next(error);
    }
};