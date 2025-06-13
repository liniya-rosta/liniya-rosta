import { Request, Response, NextFunction } from "express";
import LaminateItem from "../models/LaminateItem";

export const getLaminateItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laminateItems = await LaminateItem.find();
        res.send(laminateItems);
    } catch (e) {
        next(e);
    }
}

export const getLaminateItemById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        const laminateItem = await LaminateItem.findById(id);

        if (!laminateItem) {
            res.status(404).send({message: 'Продукт не найден'});
            return;
        }

        res.send(laminateItem);
    } catch (e) {
        next(e);
    }
}